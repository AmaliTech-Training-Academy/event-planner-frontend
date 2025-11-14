export interface AcceptInvitationPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  invitationToken: string;
}
