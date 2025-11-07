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
  // Public properties for template access
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

  // Signals - only for reactive values that trigger UI updates
  protected readonly isEditModalOpen: WritableSignal<boolean> = signal(false);
  protected readonly isPreviewModalOpen: WritableSignal<boolean> =
    signal(false);
  protected readonly selectedInvite: WritableSignal<SavedInvite | undefined> =
    signal(undefined);

  // Private constants
  private readonly _MODAL_CLOSE_DELAY_MS: number = 300;

  constructor(public readonly layoutService: LayoutService) {
    console.log('🏗️ SavedInviteComponent: Constructor called');

    this.layoutService.pageTitle.set('Saved Invites');
    this.layoutService.logoSrc.set('icons/save-icon.png');
    this.layoutService.logoAlt.set('Saved Invites');

    console.log(
      '📊 Initial mock invites loaded:',
      this.mockInvites.length,
      'items'
    );
  }

  // Edit modal handlers
  protected openEditModal(invite: SavedInvite): void {
    console.log('✏️ Opening edit modal for invite:', invite.eventId);
    console.log('📋 Invite data:', invite);

    // Create a deep copy to avoid reference issues
    const inviteCopy: SavedInvite = { ...invite };
    this.selectedInvite.set(inviteCopy);
    this.isEditModalOpen.set(true);

    console.log(
      '✅ Edit modal opened, selectedInvite set to:',
      this.selectedInvite()
    );
  }

  protected closeEditModal(): void {
    console.log('❌ Closing edit modal');

    this.isEditModalOpen.set(false);

    // Clear selected invite after a small delay to allow animation
    setTimeout(() => {
      console.log('🧹 Clearing selectedInvite after animation delay');
      this.selectedInvite.set(undefined);
    }, this._MODAL_CLOSE_DELAY_MS);
  }

  protected onSaveEdit(updatedInvite: SavedInvite): void {
    console.log('💾 Saving edited invite:', updatedInvite);
    console.log('🔍 Looking for invite with eventId:', updatedInvite.eventId);

    // Find the index of the invite being updated
    const index: number = this.mockInvites.findIndex(
      (inv: SavedInvite) => inv.eventId === updatedInvite.eventId
    );

    if (index !== -1) {
      console.log(`✅ Found invite at index ${index}, updating...`);

      // Update the invite in the array immutably
      this.mockInvites = [
        ...this.mockInvites.slice(0, index),
        updatedInvite,
        ...this.mockInvites.slice(index + 1),
      ];

      console.log('✅ Invite updated successfully');
      console.log('📊 Updated invites array:', this.mockInvites);
    } else {
      console.error('❌ Invite not found in array!');
    }

    this.closeEditModal();
  }

  // Preview modal handlers
  protected openPreviewModal(invite: SavedInvite): void {
    console.log('👁️ Opening preview modal for invite:', invite.eventId);

    const inviteCopy: SavedInvite = { ...invite };
    this.selectedInvite.set(inviteCopy);
    this.isPreviewModalOpen.set(true);

    console.log('✅ Preview modal opened');
  }

  protected closePreviewModal(): void {
    console.log('❌ Closing preview modal');

    this.isPreviewModalOpen.set(false);

    setTimeout(() => {
      console.log('🧹 Clearing selectedInvite after animation delay');
      this.selectedInvite.set(undefined);
    }, this._MODAL_CLOSE_DELAY_MS);
  }

  // Delete action
  protected onDelete(invite: SavedInvite): void {
    console.log('🗑️ Delete requested for invite:', invite.eventId);
    console.log('📋 Invite data:', invite);

    // Confirmation dialog
    const confirmed: boolean = confirm(
      `Are you sure you want to delete "${invite.invitationTitle}"?`
    );

    if (confirmed) {
      console.log('✅ Deletion confirmed, removing invite...');

      const beforeCount: number = this.mockInvites.length;

      this.mockInvites = this.mockInvites.filter(
        (inv: SavedInvite) => inv.eventId !== invite.eventId
      );

      const afterCount: number = this.mockInvites.length;

      console.log(`✅ Invite deleted. Count: ${beforeCount} → ${afterCount}`);
      console.log('📊 Remaining invites:', this.mockInvites);
    } else {
      console.log('❌ Deletion cancelled by user');
    }
  }
}
