// core/models/audit.model.ts

// ============================================
// API RESPONSE MODELS (Backend DTOs)
// ============================================

export interface AuditLog {
  id: string;
  email: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  auditListResponse: AuditLog[];
}

// ============================================
// UI/TABLE MODELS
// ============================================

export interface AuditLogTableData {
  id: string;
  email: string;
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  action: string; // Can be derived or added later
}

// ============================================
// UTILITY/MAPPER FUNCTIONS
// ============================================

/**
 * Converts API AuditLog to table display format
 */
export function mapAuditLogToTableData(log: AuditLog): AuditLogTableData {
  return {
    id: log.id,
    email: log.email,
    ipAddress: log.ipAddress,
    timestamp: log.timestamp,
    formattedTimestamp: formatAuditTimestamp(log.timestamp),
    action: 'Login', // Default action, can be customized based on your needs
  };
}

/**
 * Format audit timestamp for display
 */
export function formatAuditTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Format date only
 */
export function formatAuditDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/**
 * Format time only
 */
export function formatAuditTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
