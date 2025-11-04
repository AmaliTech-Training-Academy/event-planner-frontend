import { Component } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from '../../../../shared/admin-ui/data-table/data-table.component';

interface SavedInvite {
  invitationTitle: string;
  eventId: string;
  event: string;
  createdBy: string;
  lastEdited: string;
  recipients: number;
}

@Component({
  selector: 'app-saved-invite',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './saved-invite.component.html',
  styleUrls: ['./saved-invite.component.scss'],
})
export class SavedInviteComponent {
  public readonly mockInvites: ReadonlyArray<SavedInvite> = [
    {
      invitationTitle: 'Early Bird Registration Offer',
      eventId: '#125678',
      event: 'Tech Conference 2023',
      createdBy: 'John Smith',
      lastEdited: '2023-10-15',
      recipients: 12,
    },
    {
      invitationTitle: 'Workshop Registration Reminder',
      eventId: '#455678',
      event: 'Digital Marketing Workshop',
      createdBy: 'Lisa Johnson',
      lastEdited: '2023-09-28',
      recipients: 21,
    },
    {
      invitationTitle: 'Early Bird Registration Offer',
      eventId: '#665178',
      event: 'Product Design Seminar',
      createdBy: 'Michael Brown',
      lastEdited: '2023-11-10',
      recipients: 85,
    },
    {
      invitationTitle: 'VIP Guest Invitation',
      eventId: '#412567',
      event: 'Annual Gala Dinner',
      createdBy: 'Sarah Davis',
      lastEdited: '2023-10-22',
      recipients: 15,
    },
    {
      invitationTitle: 'Annual Networking Event',
      eventId: '#912567',
      event: 'Leadership Summit 2023',
      createdBy: 'Robert Wilson',
      lastEdited: '2023-12-05',
      recipients: 20,
    },
  ];

  public readonly columns: ReadonlyArray<TableColumn<SavedInvite>> = [
    { key: 'invitationTitle', header: 'Invitation Title' },
    { key: 'eventId', header: 'Event ID' },
    { key: 'event', header: 'Event' },
    { key: 'createdBy', header: 'Created By' },
    { key: 'lastEdited', header: 'Last Edited' },
    { key: 'recipients', header: 'Recipients' },
  ];

  public readonly actions: ReadonlyArray<TableAction<SavedInvite>> = [
    {
      icon: 'icons/view-icon.png',
      label: 'Preview',
      color: 'view',
      type: 'action',
      handler: (item) => this.onPreview(item),
    },
    {
      icon: 'icons/edit-icon.png',
      label: 'Edit',
      color: 'edit',
      type: 'action',
      handler: (item) => this.onEdit(item),
    },
    {
      icon: 'icons/delete.png',
      label: 'Delete',
      color: 'delete',
      type: 'action',
      handler: (item) => this.onDelete(item),
    },
  ];

  constructor(public layoutService: LayoutService) {
    this.layoutService.pageTitle.set('Saved Invites');
    this.layoutService.logoSrc.set('icons/save-icon.png');
    this.layoutService.logoAlt.set('Saved Invites');
  }

  private onPreview(invite: SavedInvite): void {
    console.log('Preview invite:', invite);
  }

  private onEdit(invite: SavedInvite): void {
    console.log('Edit invite:', invite);
  }

  private onDelete(invite: SavedInvite): void {
    console.log('Delete invite:', invite);
  }
}
