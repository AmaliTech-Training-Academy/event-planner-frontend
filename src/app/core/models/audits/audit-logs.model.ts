// core/models/audits/audit-logs.model.ts

/**
 * Backend API response model
 */
export interface AuditLog {
  id: string;
  email: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  action?: string;
  status?: string;
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  auditListResponse: AuditLog[];
}

/**
 * UI/Table display model
 */
export interface AuditLogTableData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  action: string;
  status: string;
}

// Cache user statuses for consistency
const userStatusCache = new Map<string, string>();

/**
 * Enhanced name extraction from email
 */
const extractNameFromEmail = (email: string): string => {
  const username = email.split('@')[0];

  return username
    .replace(/[._-]/g, ' ') // Replace separators with spaces
    .split(' ')
    .map((part) => {
      // Handle camelCase
      if (part.length > 1 && part === part.toLowerCase()) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      return part;
    })
    .join(' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

/**
 * Get consistent mock status per user
 */
const getMockStatus = (email: string): string => {
  if (!userStatusCache.has(email)) {
    // 70% successful, 30% failed for realistic distribution
    userStatusCache.set(email, Math.random() > 0.3 ? 'Successful' : 'Failed');
  }
  return userStatusCache.get(email)!;
};

/**
 * Maps backend AuditLog to UI-friendly AuditLogTableData
 */
export function mapAuditLogToTableData(log: AuditLog): AuditLogTableData {
  const name = log.name || extractNameFromEmail(log.email);

  let formattedTimestamp = 'Invalid Date';
  try {
    const date = new Date(log.timestamp);
    formattedTimestamp = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.warn('Invalid timestamp:', log.timestamp);
  }

  return {
    id: log.id,
    name,
    email: log.email,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`,
    ipAddress: log.ipAddress || 'N/A',
    timestamp: log.timestamp,
    formattedTimestamp,
    action: log.action || 'Login Attempt',
    status: getMockStatus(log.email),
  };
}
