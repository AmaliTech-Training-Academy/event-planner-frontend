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
}

export interface AuditLogsResponse {
  pageNumber: number;
  pageSize: number;
  auditListResponse: AuditLog[];
}

/**
 * UI/Table display model
 */
export interface AuditLogTableData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  profileImageUrl: string; // For the data-table component
  ipAddress: string;
  timestamp: string;
  formattedTimestamp: string;
  action: string;
  status: string;
}

/**
 * Generate a consistent avatar URL for a user email
 * Uses a simple hash to pick from a predefined set of avatar images
 */
function getAvatarForEmail(email: string): string {
  // List of diverse avatar images (you can replace these with your own URLs)
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9',
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=13',
    'https://i.pravatar.cc/150?img=14',
    'https://i.pravatar.cc/150?img=16',
    'https://i.pravatar.cc/150?img=17',
    'https://i.pravatar.cc/150?img=20',
    'https://i.pravatar.cc/150?img=23',
    'https://i.pravatar.cc/150?img=26',
    'https://i.pravatar.cc/150?img=27',
    'https://i.pravatar.cc/150?img=29',
    'https://i.pravatar.cc/150?img=31',
    'https://i.pravatar.cc/150?img=32',
    'https://i.pravatar.cc/150?img=33',
    'https://i.pravatar.cc/150?img=36',
    'https://i.pravatar.cc/150?img=41',
  ];

  // Simple hash function to consistently map email to avatar
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatars.length;

  return avatars[index];
}

/**
 * Generate a name from an email address
 */
function generateNameFromEmail(email: string): string {
  const username = email.split('@')[0];

  // Split by common separators
  const parts = username.split(/[._-]/);

  // Capitalize each part
  const capitalized = parts.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  return capitalized.join(' ');
}

/**
 * Determine login status based on IP address presence
 * (You may want to adjust this logic based on your actual business rules)
 */
function determineStatus(log: AuditLog): string {
  // If there's an IP address, assume login was successful
  // You should adjust this based on your actual API data
  return log.ipAddress && log.ipAddress !== 'N/A' ? 'Successful' : 'Failed';
}

/**
 * Maps backend AuditLog to UI-friendly AuditLogTableData
 */
export function mapAuditLogToTableData(log: AuditLog): AuditLogTableData {
  // Generate name from email
  const name = generateNameFromEmail(log.email);

  // Format timestamp to match the design
  const date = new Date(log.timestamp);
  const formattedTimestamp = date
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');

  // Generate consistent avatar for this email
  const avatar = getAvatarForEmail(log.email);

  // Determine action and status
  const action = 'Login';
  const status = determineStatus(log);

  return {
    id: log.id,
    name,
    email: log.email,
    avatar,
    profileImageUrl: avatar, // Required by data-table component
    ipAddress: log.ipAddress || 'N/A',
    timestamp: log.timestamp,
    formattedTimestamp,
    action,
    status,
  };
}
