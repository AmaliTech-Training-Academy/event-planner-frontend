import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type InvitationRole = 'ORGANISER' | 'CO_ORGANIZER' | 'VENUE_STAFF' | 'ATTENDEE';

export interface Invitee {
  inviteeName: string;
  inviteeEmail: string;
  role: InvitationRole; 
}

export interface InvitationPayload {
  invitationTitle: string;
  invitees: Invitee[];
  event: number;
  status: 'SAVE' | 'SEND';
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly _http = inject(HttpClient);
  
  
  private readonly API_URL = 'https://api.sankofagrid.com/api/v1/event-invitation';

  sendInvitation(payload: InvitationPayload): Observable<any> {
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post(this.API_URL, payload, { headers });
  }
}

export interface AcceptInvitationRequest {
  fullName: string;
  invitationCode: string; 
  password: string;
}