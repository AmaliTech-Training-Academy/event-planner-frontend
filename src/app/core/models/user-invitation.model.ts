/** Invite user payload */
export interface InviteUserPayload {
  invitationTitle: string;
  invitees: Array<{
    inviteeName: string;
    inviteeEmail: string;
    role: string;
  }>;
  event: number;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'SAVE';
  message: string;
}

/** Invite user response */
export interface InviteUserResponse {
  data: {
    invitationsSent: number;
  };
  description: string | null;
}

/** Individual invitation item */
export interface Invitation {
  invitationId: string;
  invitationTitle: string;
  event: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'SAVE';
  message?: string;
  invitees: Array<{
    inviteeName: string;
    inviteeEmail: string;
    role: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

/** Fetch invitations response */
export interface FetchInvitationsResponse {
  description: string | null;
  data: {
    content: Invitation[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: { unsorted: boolean; sorted: boolean; empty: boolean };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: { unsorted: boolean; sorted: boolean; empty: boolean };
    first: boolean;
    empty: boolean;
  };
}
