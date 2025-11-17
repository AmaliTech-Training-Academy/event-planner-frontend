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
