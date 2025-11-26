import mongoose, { Schema, model } from 'mongoose';

const auditEventSchema = new Schema({
  occurred_at: { type: Date, default: Date.now, index: true },
  action: { type: String, required: true, index: true },
  actor_id: { type: Schema.Types.ObjectId, ref: 'users', index: true },
  actor_type: { type: String, default: 'user' },
  actor_name: { type: String },
  actor_email: { type: String },
  entity_type: { type: String, index: true },
  entity_id: { type: Schema.Types.Mixed, index: true },
  ip: String,
  user_agent: String,
  route: String,
  method: String,
  request_id: String,
  meta: Schema.Types.Mixed,
  before: Schema.Types.Mixed,
  after: Schema.Types.Mixed,
}, { timestamps: true });

auditEventSchema.index({ entity_type: 1, entity_id: 1, occurred_at: -1 });
auditEventSchema.index({ actor_id: 1, occurred_at: -1 });

export const AuditEvent = model('audit_events', auditEventSchema);
