// ============================================
// saved-invite-page.component.ts (CLEANED)
// ============================================
import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../../../core/services/layout.service';
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from '../../../../shared/admin-ui/data-table/data-table.component';
import { EditSavedInviteComponent } from './components/edit-saved-invite-modal/edit-saved-invite-modal.component';
import { ViewSavedInviteComponent } from './components/view-saved-invite-modal/view-saved-invite-modal.component';

interface SavedInvite {
  readonly invitationTitle: string;
  readonly eventId: string;
  readonly event: string;
  readonly createdBy: string;
  readonly lastEdited: string;
  readonly recipients: number;
}

@Component({
  selector: 'app-saved-invite',
  standalone: true,
  imports: [
    DataTableComponent,
    EditSavedInviteComponent,
    ViewSavedInviteComponent,
  ],
  templateUrl: './saved-invite-page.component.html',
  styleUrls: ['./saved-invite-page.component.scss'],
})
export class SavedInviteComponent implements OnInit {
  private readonly _layoutService = inject(LayoutService);
  private readonly MODAL_CLOSE_DELAY_MS = 300;

  private readonly _invites = signal<ReadonlyArray<SavedInvite>>([
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
  ]);

  private readonly _isEditModalOpen = signal<boolean>(false);
  private readonly _isPreviewModalOpen = signal<boolean>(false);
  private readonly _selectedInvite = signal<SavedInvite | undefined>(undefined);

  public readonly invites = computed(() => this._invites());
  public readonly isEditModalOpen = computed(() => this._isEditModalOpen());
  public readonly isPreviewModalOpen = computed(() => this._isPreviewModalOpen());
  public readonly selectedInvite = computed(() => this._selectedInvite());

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

  public ngOnInit(): void {
    this._layoutService.pageTitle.set('Saved Invites');
    this._layoutService.logoSrc.set('icons/save-icon.png');
    this._layoutService.logoAlt.set('Saved Invites Icon');
  }

  public openEditModal(invite: SavedInvite): void {
    this._selectedInvite.set({ ...invite });
    this._isEditModalOpen.set(true);
  }

  public closeEditModal(): void {
    this._isEditModalOpen.set(false);
    setTimeout(() => this._selectedInvite.set(undefined), this.MODAL_CLOSE_DELAY_MS);
  }

  public onSaveEdit(updatedInvite: SavedInvite): void {
    const currentInvites = this._invites();
    const index = currentInvites.findIndex(
      (inv) => inv.eventId === updatedInvite.eventId
    );

    if (index !== -1) {
      const updatedInvites = [
        ...currentInvites.slice(0, index),
        updatedInvite,
        ...currentInvites.slice(index + 1),
      ];
      this._invites.set(updatedInvites);
    }

    this.closeEditModal();
  }

  public openPreviewModal(invite: SavedInvite): void {
    this._selectedInvite.set({ ...invite });
    this._isPreviewModalOpen.set(true);
  }

  public closePreviewModal(): void {
    this._isPreviewModalOpen.set(false);
    setTimeout(() => this._selectedInvite.set(undefined), this.MODAL_CLOSE_DELAY_MS);
  }

  public onDelete(invite: SavedInvite): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${invite.invitationTitle}"?`
    );

    if (confirmed) {
      this._invites.set(
        this._invites().filter((inv) => inv.eventId !== invite.eventId)
      );
    }
  }
}
