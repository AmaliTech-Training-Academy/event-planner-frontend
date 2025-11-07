import { Component, signal, WritableSignal } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { EditSavedInviteComponent } from './components/edit-saved-invite-modal/edit-saved-invite-modal.component';
import { ViewSavedInviteComponent } from './components/view-saved-invite-modal/view-saved-invite-modal.component';

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
  imports: [
    DataTableComponent,
    EditSavedInviteComponent,
    ViewSavedInviteComponent,
  ],
  templateUrl: './saved-invite.component.html',
  styleUrls: ['./saved-invite.component.scss'],
})
export class SavedInviteComponent {
  public mockInvites: SavedInvite[] = [
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
      handler: (item: SavedInvite) => this.openPreviewModal(item),
    },
    {
      icon: 'icons/edit-icon.png',
      label: 'Edit',
      color: 'edit',
      type: 'action',
      handler: (item: SavedInvite) => this.openEditModal(item),
    },
    {
      icon: 'icons/delete.png',
      label: 'Delete',
      color: 'delete',
      type: 'action',
      handler: (item: SavedInvite) => this.onDelete(item),
    },
  ];

  protected readonly isEditModalOpen: WritableSignal<boolean> = signal(false);
  protected readonly isPreviewModalOpen: WritableSignal<boolean> =
    signal(false);
  protected readonly selectedInvite: WritableSignal<SavedInvite | undefined> =
    signal(undefined);

  private readonly _MODAL_CLOSE_DELAY_MS: number = 300;

  constructor(public readonly layoutService: LayoutService) {

    this.layoutService.pageTitle.set('Saved Invites');
    this.layoutService.logoSrc.set('icons/save-icon.png');
    this.layoutService.logoAlt.set('Saved Invites');

    
  }

  protected openEditModal(invite: SavedInvite): void {
  
    const inviteCopy: SavedInvite = { ...invite };
    this.selectedInvite.set(inviteCopy);
    this.isEditModalOpen.set(true);

  
  }

  protected closeEditModal(): void {

    this.isEditModalOpen.set(false);

    setTimeout(() => {
      this.selectedInvite.set(undefined);
    }, this._MODAL_CLOSE_DELAY_MS);
  }

  protected onSaveEdit(updatedInvite: SavedInvite): void {
  
    const index: number = this.mockInvites.findIndex(
      (inv: SavedInvite) => inv.eventId === updatedInvite.eventId
    );

    if (index !== -1) {

      this.mockInvites = [
        ...this.mockInvites.slice(0, index),
        updatedInvite,
        ...this.mockInvites.slice(index + 1),
      ];

    } 

    this.closeEditModal();
  }

  protected openPreviewModal(invite: SavedInvite): void {

    const inviteCopy: SavedInvite = { ...invite };
    this.selectedInvite.set(inviteCopy);
    this.isPreviewModalOpen.set(true);

  }

  protected closePreviewModal(): void {

    this.isPreviewModalOpen.set(false);

    setTimeout(() => {
      this.selectedInvite.set(undefined);
    }, this._MODAL_CLOSE_DELAY_MS);
  }

  protected onDelete(invite: SavedInvite): void {

    const confirmed: boolean = confirm(
      `Are you sure you want to delete "${invite.invitationTitle}"?`
    );

    if (confirmed) {
     

      const beforeCount: number = this.mockInvites.length;

      this.mockInvites = this.mockInvites.filter(
        (inv: SavedInvite) => inv.eventId !== invite.eventId
      );


    
    } 
  }
}
