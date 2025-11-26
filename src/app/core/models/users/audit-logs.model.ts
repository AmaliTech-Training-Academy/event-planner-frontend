// core/models/audits/audit-logs.model.ts

export interface AuditLog {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl: string;
  ipAddress: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  auditStatus: 'SUCCESS' | 'FAILED';
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  data: AuditLog[];
}

export interface AuditLogTableData {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string;
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  status: string;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function mapAuditLogToTableData(log: AuditLog): AuditLogTableData {
  return {
    id: log.id.toString(),
    fullName: log.fullName,
    email: log.email,
    profileImageUrl: log.profileImageUrl,
    ipAddress: log.ipAddress,
    timestamp: log.timestamp,
    formattedTimestamp: formatTimestamp(log.timestamp),
    status: log.auditStatus === 'SUCCESS' ? 'successful' : 'failed', // Changed this line
  };
}
