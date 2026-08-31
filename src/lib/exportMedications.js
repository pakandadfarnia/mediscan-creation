import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { translate, isRTL } from "@/lib/i18n";

// Builds a downloadable PDF of the user's medication table in a chosen
// language. We render an off-screen HTML table, rasterize it with
// html2canvas, then lay it across as many A4 landscape pages as needed.

// Columns to include in the exported table (key = medication field, labelKey
// = i18n key for the header). `badge`/`array` flags control how values render.
const COLS = [
  { key: "name", labelKey: "table.name" },
  { key: "generic_name", labelKey: "table.generic" },
  { key: "category", labelKey: "table.category", badge: true },
  { key: "dose", labelKey: "table.dose" },
  { key: "form", labelKey: "table.form" },
  { key: "frequency", labelKey: "table.frequency" },
  { key: "route", labelKey: "table.route" },
  { key: "quantity", labelKey: "table.quantity" },
  { key: "purpose", labelKey: "table.purpose" },
  { key: "active_ingredients", labelKey: "table.active", array: true },
  { key: "inactive_ingredients", labelKey: "table.inactive", array: true },
  { key: "side_effects", labelKey: "table.sideEffects", array: true },
  { key: "warnings", labelKey: "table.warnings", array: true },
  { key: "storage", labelKey: "table.storage" },
  { key: "manufacturer", labelKey: "table.manufacturer" },
  { key: "expiration_date", labelKey: "table.expiration" },
];

// Map category values to their localized label keys.
const CAT_KEY = { prescription: "table.catRx", otc: "table.catOtc", supplement: "table.catSupp" };

// Escape HTML-special characters so cell values can't break the markup.
const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Render one cell's value as safe HTML in the chosen language.
function cellValue(m, c, lang) {
  const v = m[c.key];
  if (c.badge) return translate(lang, CAT_KEY[v] || "table.catRx");
  if (c.array) return (Array.isArray(v) ? v : []).map((s) => esc(s)).join(", ") || "—";
  return esc(v || "—");
}

// Build the full HTML document for the table, localized and RTL-aware.
function buildHtml(meds, lang, profileName) {
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const locale = lang === "zh" ? "zh-CN" : lang === "pt" ? "pt-BR" : lang;
  const dateStr = new Date().toLocaleDateString(locale);
  // Optional "Prepared for <name>" line when a profile name exists.
  const prepared = profileName
    ? `<div style="font-size:12px;color:#78716c;margin-bottom:2px;">${translate(lang, "export.preparedFor")} ${esc(profileName)}</div>`
    : "";
  const headers = COLS.map((c) => `<th>${esc(translate(lang, c.labelKey))}</th>`).join("");
  const rows = meds.map((m) => `<tr>${COLS.map((c) => `<td>${cellValue(m, c, lang)}</td>`).join("")}</tr>`).join("");
  return `
  <div dir="${dir}" style="width:1100px;font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:#1c1917;padding:28px;background:#fff;box-sizing:border-box;">
    <h1 style="font-size:24px;margin:0 0 6px;">${esc(translate(lang, "table.title"))}</h1>
    ${prepared}
    <div style="font-size:12px;color:#78716c;margin-bottom:18px;">${translate(lang, "export.date")}: ${dateStr}</div>
    <table style="border-collapse:collapse;width:100%;font-size:11px;">
      <thead><tr style="background:#f5f5f4;">${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <style>
      table, th, td { border:1px solid #e7e5e4; }
      th, td { padding:8px 10px; text-align:left; vertical-align:top; }
      thead th { font-weight:600; color:#57534e; }
      tbody tr:nth-child(even) { background:#fafaf9; }
    </style>
  </div>`;
}

// Render the HTML off-screen, rasterize it to an image, and save a multi-page
// A4 landscape PDF.
export async function downloadMedicationsPdf(meds, lang, profileName, filename) {
  // Create an off-screen container so the table renders without showing on screen.
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-99999px;top:0;background:#ffffff;";
  container.innerHTML = buildHtml(meds, lang, profileName);
  document.body.appendChild(container);
  try {
    // Rasterize the HTML to a canvas at 2x for crisp output.
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    // Fit the image to the page width, then paginate by slicing the height.
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, "PNG", 0, position, imgW, imgH);
    heightLeft -= pageH;
    // Add extra pages until the whole image has been laid down.
    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgH;
      pdf.addImage(img, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(filename);
  } finally {
    // Always clean up the off-screen container.
    document.body.removeChild(container);
  }
}