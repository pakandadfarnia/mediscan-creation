import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const LANG_NAME = {
  en: 'English', es: 'Spanish', fr: 'French', zh: 'Simplified Chinese',
  pt: 'Portuguese', ar: 'Arabic', fa: 'Farsi (Persian)', ja: 'Japanese', ko: 'Korean'
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const medication = body?.medication;
    const language = body?.language;
    if (!medication || typeof medication !== 'object') {
      return Response.json({ error: 'medication object is required' }, { status: 400 });
    }
    if (!language || !LANG_NAME[language]) {
      return Response.json({ error: 'A supported language code is required' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt:
        "You are a medical translation assistant. You are given a JSON object describing a medication, extracted from a product label. " +
        "Translate the DESCRIPTIVE text fields into " + LANG_NAME[language] + ", using plain, everyday words a non-doctor can understand (avoid medical jargon — e.g. say 'may make you sleepy' not 'may cause sedation'). " +
        "Translate these fields: purpose, side_effects, warnings, frequency, storage, route, form, inactive_ingredients, notes. " +
        "DO NOT translate or change these fields — return them exactly as given: name, generic_name, active_ingredients, dose, quantity, manufacturer, expiration_date, category. " +
        "Active and inactive ingredient NAMES that are standard scientific/chemical terms (e.g. acetaminophen, lactose, titanium dioxide) must be kept in their internationally recognized form, NOT translated, so they can still be matched against an allergy list. " +
        "Keep the exact same JSON structure and field names. Return only the translated object, with the same fields as the input.\n\n" +
        "INPUT MEDICATION JSON:\n" + JSON.stringify(medication),
      response_json_schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          category: { type: 'string', enum: ['prescription', 'otc', 'supplement'] },
          generic_name: { type: 'string' },
          active_ingredients: { type: 'array', items: { type: 'string' } },
          dose: { type: 'string' },
          form: { type: 'string' },
          frequency: { type: 'string' },
          route: { type: 'string' },
          quantity: { type: 'string' },
          purpose: { type: 'string' },
          inactive_ingredients: { type: 'array', items: { type: 'string' } },
          side_effects: { type: 'array', items: { type: 'string' } },
          warnings: { type: 'array', items: { type: 'string' } },
          storage: { type: 'string' },
          manufacturer: { type: 'string' },
          expiration_date: { type: 'string' },
          notes: { type: 'string' }
        }
      }
    });

    // Merge: start from the original so untranslated/missing fields are preserved,
    // then overlay the translated fields the model returned.
    const translated = typeof result === 'string' ? (() => { try { return JSON.parse(result); } catch { return {}; } })() : (result || {});
    const merged = { ...medication };
    const textFields = ['name', 'generic_name', 'active_ingredients', 'dose', 'form', 'frequency', 'route', 'quantity', 'purpose', 'inactive_ingredients', 'side_effects', 'warnings', 'storage', 'manufacturer', 'expiration_date', 'notes'];
    const hadValue = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);
    for (const k of textFields) {
      const tv = translated[k];
      // Only overlay a translation when the original field actually had content
      // and the model returned a real (non-placeholder) value.
      if (hadValue(medication[k]) && hadValue(tv) && tv !== 'n/a' && tv !== 'N/A') {
        merged[k] = tv;
      }
    }
    // category must remain one of the enums; keep original if model returned garbage.
    if (translated.category && ['prescription', 'otc', 'supplement'].includes(translated.category)) {
      merged.category = translated.category;
    }

    return Response.json({ result: merged });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}