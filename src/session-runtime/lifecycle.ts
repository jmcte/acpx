import type { AgentLifecycleSnapshot } from "../client.js";
import { normalizeRuntimeSessionId } from "../runtime-session-id.js";
import type { SessionConversation, SessionRecord } from "../types.js";

/**
 * Coerce a protocolVersion to a number.  Some agents (e.g. Gemini CLI) return
 * protocolVersion as a string such as "1" or "1.0".  The ACP spec expects a
 * number, so we normalise here to avoid type-mismatch errors downstream.
 */
export function coerceProtocolVersion(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

export function applyLifecycleSnapshotToRecord(
  record: SessionRecord,
  snapshot: AgentLifecycleSnapshot,
): void {
  record.pid = snapshot.pid;
  record.agentStartedAt = snapshot.startedAt;

  if (snapshot.lastExit) {
    record.lastAgentExitCode = snapshot.lastExit.exitCode;
    record.lastAgentExitSignal = snapshot.lastExit.signal;
    record.lastAgentExitAt = snapshot.lastExit.exitedAt;
    record.lastAgentDisconnectReason = snapshot.lastExit.reason;
    return;
  }

  record.lastAgentExitCode = undefined;
  record.lastAgentExitSignal = undefined;
  record.lastAgentExitAt = undefined;
  record.lastAgentDisconnectReason = undefined;
}

export function reconcileAgentSessionId(
  record: SessionRecord,
  agentSessionId: string | undefined,
): void {
  const normalized = normalizeRuntimeSessionId(agentSessionId);
  if (!normalized) {
    return;
  }

  record.agentSessionId = normalized;
}

export function sessionHasAgentMessages(record: SessionRecord): boolean {
  return record.messages.some(
    (message) => typeof message === "object" && message !== null && "Agent" in message,
  );
}

export function applyConversation(
  record: SessionRecord,
  conversation: SessionConversation,
): void {
  record.title = conversation.title;
  record.messages = conversation.messages;
  record.updated_at = conversation.updated_at;
  record.cumulative_token_usage = conversation.cumulative_token_usage;
  record.request_token_usage = conversation.request_token_usage;
}
