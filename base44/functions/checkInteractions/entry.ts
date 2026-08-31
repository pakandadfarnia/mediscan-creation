import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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
    const others = Array.isArray(body?.others) ? body.others : [];
    const language = body?.language && LANG_NAME[body.language] ? body.language : 'en';

    if (!medication || typeof medication.name !== 'string' || !medication.name) {
      return Response.json({ error: 'medication.name is required' }, { status: 400 });
    }
    const cap = 20;
    const safeOthers = others
      .filter((m) => m && typeof m.name === 'string' && m.name && m.name !== medication.name)
      .slice(0, cap);

    const medLine = (m) =>
      `${m.name}${m.generic_name ? ` (${m.generic_name})` : ''} — active ingredients: ${(Array.isArray(m.active_ingredients) && m.active_ingredients.length ? m.active_ingredients.join(', ') : 'unknown')}`;

    const targetLine = medLine(medication);
    const othersLines = safeOthers.length
      ? safeOthers.map((m, i) => `${i + 1}. ${medLine(m)}`).join('\n')
      : '(no other medications on record)';

    const prompt =
      "You are a clinical pharmacist screening a patient's medication for clinically significant interactions.\n\n" +
      "MEDICATION BEING CHECKED:\n" + targetLine + "\n\n" +
      "OTHER MEDICATIONS THE PATIENT IS TAKING:\n" + othersLines + "\n\n" +
      "Identify two kinds of interactions for the MEDICATION BEING CHECKED only:\n" +
      "1. drug_drug: interactions between it and any of the other medications, based on their active ingredients.\n" +
      "2. drug_food: foods, beverages, or dietary habits that should be avoided or limited while taking it (e.g. grapefruit with statins, vitamin-K foods with warfarin, alcohol with CNS depressants).\n\n" +
      "Rules: only flag clinically established, meaningful interactions — do not invent or speculate. " +
      "Use severity \"danger\" for serious/contraindicated/avoid-combination, \"caution\" for moderate/monitor. " +
      "Write each description in " + LANG_NAME[language] + ", using plain, everyday words a non-doctor can understand — no medical jargon. For example: 'Taking these together can raise your risk of bleeding' instead of 'increases anticoagulant effect'. " +
      "Keep descriptions to one clear sentence. If there are none for a category, return an empty array for it.";

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          drug_drug: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                other_med: { type: 'string', description: 'Name of the interacting medication from the list' },
                ingredient: { type: 'string', description: 'The active ingredient involved, if applicable' },
                severity: { type: 'string', enum: ['danger', 'caution'] },
                description: { type: 'string' }
              },
              required: ['other_med', 'severity', 'description']
            }
          },
          drug_food: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                food: { type: 'string' },
                severity: { type: 'string', enum: ['danger', 'caution'] },
                description: { type: 'string' }
              },
              required: ['food', 'severity', 'description']
            }
          }
        },
        required: ['drug_drug', 'drug_food']
      }
    });

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}