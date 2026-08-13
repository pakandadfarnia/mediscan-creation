import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { translate, isRTL } from "@/lib/i18n";

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

const CAT_KEY = { prescription: "table.catRx", otc: "table.catOtc", supplement: "table.catSupp" };

const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function cellValue(m, c, lang) {
  const v = m[c.key];
  if (c.badge) return translate(lang, CAT_KEY[v] || "table.catRx");
  if (c.array) return (Array.isArray(v) ? v : []).map((s) => esc(s)).join(", ") || "—";
  return esc(v || "—");
}

function buildHtml(meds, lang, profileName) {
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const locale = lang === "zh" ? "zh-CN" : lang === "pt" ? "pt-BR" : lang;
  const dateStr = new Date().toLocaleDateString(locale);
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

export async function downloadMedicationsPdf(meds, lang, profileName, filename) {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-99999px;top:0;background:#ffffff;";
  container.innerHTML = buildHtml(meds, lang, profileName);
  document.body.appendChild(container);
  try {
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, "PNG", 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgH;
      pdf.addImage(img, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}