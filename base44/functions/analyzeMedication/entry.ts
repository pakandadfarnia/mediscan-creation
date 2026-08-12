import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const imageUrl = body?.image_url;
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.length > 2000) {
      return Response.json({ error: 'A valid image_url is required' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt:
        "You are a pharmacology assistant. Look at this photo of a medication package, bottle, blister pack or label. Identify the medication and fill in every field you can. " +
        "Use the visible label text first; supplement with well-established general knowledge about that medication for purpose, typical frequency, common side effects, warnings and storage. " +
        "If a field truly cannot be determined, return an empty string (or empty list). Keep dose as strength per unit (e.g. '500 mg'). Frequency should be plain language (e.g. 'Twice daily'). " +
        "If the image does not show a medication, set is_medication to false.",
      file_urls: [imageUrl],
      response_json_schema: {
        type: 'object',
        properties: {
          is_medication: { type: 'boolean' },
          name: { type: 'string' },
          generic_name: { type: 'string' },
          dose: { type: 'string' },
          form: { type: 'string' },
          frequency: { type: 'string' },
          route: { type: 'string' },
          quantity: { type: 'string' },
          purpose: { type: 'string' },
          side_effects: { type: 'array', items: { type: 'string' } },
          warnings: { type: 'array', items: { type: 'string' } },
          storage: { type: 'string' },
          manufacturer: { type: 'string' },
          expiration_date: { type: 'string' }
        },
        required: ['is_medication', 'name']
      }
    });

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}