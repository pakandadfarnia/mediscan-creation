import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    let imageUrls = body?.image_urls;
    if (imageUrls && !Array.isArray(imageUrls)) imageUrls = [imageUrls];
    if (!imageUrls && body?.image_url) imageUrls = [body.image_url];
    if (!Array.isArray(imageUrls) || imageUrls.length === 0 ||
        !imageUrls.every((u) => typeof u === 'string' && u.length > 0 && u.length < 2000)) {
      return Response.json({ error: 'One or more valid image_urls are required' }, { status: 400 });
    }
    if (imageUrls.length > 8) imageUrls = imageUrls.slice(0, 8);

    const oneOrMore = imageUrls.length === 1 ? 'this photo' : 'these ' + imageUrls.length + ' photos';
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt:
        "You are a pharmacology assistant. Look at " + oneOrMore + " of a medication package, bottle, blister pack or label. " +
        "There may be several photos showing different parts of the same medication (front, back, side panel, insert). Combine information from ALL of them to fill in every field as completely and accurately as possible. " +
        "Use the visible label text first; supplement with well-established general knowledge about that medication for purpose, typical frequency, common side effects, warnings and storage. " +
        "CRITICAL: identify ALL 'active ingredients' (the medicinal ingredients) including EACH component of combination drugs. For example, Percocet has active_ingredients ['oxycodone', 'acetaminophen']; Tylenol has ['acetaminophen']; Advil Cold & Sinus may have ['ibuprofen', 'pseudoephedrine']. List every active ingredient in active_ingredients, using the most standard generic name (prefer 'acetaminophen' over 'paracetamol' or 'APAP'). This is used to detect accidental duplicate dosing. " +
        "CRITICAL: read the 'inactive ingredients' (also called 'non-medicinal ingredients' or 'excipients') section carefully — these are the fillers, binders, dyes (e.g. Yellow No. 5 / tartrazine), preservatives, starches, lactose, gluten, gelatin, etc. List every inactive ingredient you can identify in inactive_ingredients. " +
        "If a field truly cannot be determined from any photo, return an empty string (or empty list). Keep dose as strength per unit (e.g. '500 mg'). Frequency should be plain language (e.g. 'Twice daily'). " +
        "IMPORTANT: classify the item into 'category'. Use 'prescription' if it appears to be a pharmacy-dispensed Rx medicine (look for 'Rx only', an NDC with Rx, prescription number, or a drug usually requiring a prescription). Use 'otc' for over-the-counter medicines bought off the shelf (ibuprofen, acetaminophen, cold/allergy tablets, antacids, laxatives, etc.). Use 'supplement' for vitamins, minerals, herbals and dietary supplements (look for 'Supplement Facts', 'herbal', botanical names, or brands like Nature Made, Centrum, St. John's Wort, melatonin). When in doubt, prefer 'otc' for a labelled drug and 'supplement' only for supplement-fact items. " +
        "If none of the images show a medication, set is_medication to false.",
      file_urls: imageUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          is_medication: { type: 'boolean' },
          name: { type: 'string' },
          category: { type: 'string', enum: ['prescription', 'otc', 'supplement'], description: 'prescription, over-the-counter, or herbal/dietary supplement' },
          generic_name: { type: 'string' },
          active_ingredients: { type: 'array', items: { type: 'string' }, description: 'Each active medicinal ingredient, including every component of a combination drug (e.g. oxycodone and acetaminophen for Percocet)' },
          dose: { type: 'string' },
          form: { type: 'string' },
          frequency: { type: 'string' },
          route: { type: 'string' },
          quantity: { type: 'string' },
          purpose: { type: 'string' },
          inactive_ingredients: { type: 'array', items: { type: 'string' }, description: 'Fillers, binders, dyes, preservatives listed on the label' },
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