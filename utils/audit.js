import { AuditEvent } from '../models/auditEvent.model.js';

export const logAudit = async ({
  req,
  action,
  entityType,
  entityId,
  meta,
  before,
  after,
  actorName,
  actorEmail,
}) => {
  try {
    const sessionUser = req?.session?.user;
    const actor = sessionUser?.id || null;
    const ip = req?.headers?.['x-forwarded-for'] || req?.ip || req?.socket?.remoteAddress;
    const userAgent = req?.headers?.['user-agent'];
    const derivedActorName = actorName || (sessionUser ? `${sessionUser.name || ''} ${sessionUser.lastName || ''}`.trim() : undefined);
    const derivedActorEmail = actorEmail || sessionUser?.email;
    await AuditEvent.create({
      action,
      actor_id: actor,
      actor_type: 'user',
      actor_name: derivedActorName,
      actor_email: derivedActorEmail,
      entity_type: entityType,
      entity_id: entityId,
      ip,
      user_agent: userAgent,
      route: req?.originalUrl || req?.url,
      method: req?.method,
      request_id: req?.id,
      meta,
      before,
      after,
    });
  } catch (err) {
    // No interrumpir el flujo por errores de auditoría
    if (process?.env?.NODE_ENV !== 'production') {
      console.error('Audit log error:', err?.message);
    }
  }
};
