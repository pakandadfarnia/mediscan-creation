import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Deletes the app user whose email matches BLOCKED_EMAIL, if one exists.
// Admin-only: a non-admin calling this endpoint gets 403. The email is
// hardcoded server-side so the endpoint can't be pointed at arbitrary users.
const BLOCKED_EMAIL = "pakan.dadfarnia@gmail.com";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const caller = await base44.auth.me();
    if (!caller) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (caller.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    // Service role bypasses User RLS so we can find the target by email.
    const users = await base44.asServiceRole.entities.User.list();
    const target = users.find((u) => (u.email || '').toLowerCase() === BLOCKED_EMAIL.toLowerCase());

    if (!target) {
      return Response.json({ ok: true, deleted: false, reason: 'no matching user' });
    }

    await base44.asServiceRole.entities.User.delete(target.id);
    return Response.json({ ok: true, deleted: true, id: target.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}