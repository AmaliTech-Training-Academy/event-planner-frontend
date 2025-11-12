
export interface AuditLog {
  readonly user: string;
  readonly fullName: string;
  readonly email: string;
  readonly timestamp: string;
  readonly ipAddress: string;
  readonly status: AuditLogStatus;
  readonly avatar?: string;
}


export type AuditLogStatus = 'Successful' | 'Failed';


export interface AuditLogFilterOptions {
  readonly label: string;
  readonly value: string;
}


export const AUDIT_LOG_STATUS_FILTERS: ReadonlyArray<AuditLogFilterOptions> = [
  { label: 'All Status', value: 'all' },
  { label: 'Successful', value: 'successful' },
  { label: 'Failed', value: 'failed' },
] as const;
