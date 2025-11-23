import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, effect, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { USER_ROLES } from '@app/core/constants/user.constants';
import { ManageEventAttendeesResponse, ManageEventInvitee } from '@app/core/models/manage-events';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";

@Component({
  selector: 'app-guest',
  imports: [NgOptimizedImage, FormsModule, LoadingCardComponent],
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.scss'
})
export class GuestComponent implements OnInit {
  public currentEventId = input.required<number>()
  protected readonly invitees = signal<ManageEventAttendeesResponse | null>(null)
  public inviteGuest = output<void>()
  protected search = signal<string>('')
  protected guestRole = Object.values(USER_ROLES);
  protected selectedRole = signal<string>('');
  private debounceTimeoutId: ReturnType<typeof setTimeout> | null = null;
  protected loading = signal<boolean>(true);

  constructor(private readonly _manageService: ManageEventService) {

    effect(() => {
      const term = this.search();
      const role = this.selectedRole();

      if (this.debounceTimeoutId) {
        clearTimeout(this.debounceTimeoutId);
      }

      this.debounceTimeoutId = setTimeout(() => {
        this.getInvitees(term, 0, role);
      }, 300);
    });

  }

  ngOnInit(): void {

  }

  protected onInviteGuest() {
    this.inviteGuest.emit()
  }


  private getInvitees(search: string = "", page: number = 0, role: string = '') {
    const eventId = this.currentEventId()
    if (!eventId) return;
    this.loading.set(true)
    this._manageService.invitees(eventId, search, page, role).subscribe({
      next: (response) => {
        this.invitees.set(response)
      },
      error: (err) => {
        console.error('Failed to load invitees:', err);
        this.invitees.set(null);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }
}
