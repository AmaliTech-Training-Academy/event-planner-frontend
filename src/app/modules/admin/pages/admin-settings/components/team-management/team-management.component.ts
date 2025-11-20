import {
  Component,
  inject,
  Input,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '@app/shared/ui/button/button.component';
import { InviteUserModalComponent } from '@app/modules/admin/pages/user-management-page/components/invite-user-modal/invite-user-modal.component';
import { TeamMember } from '@app/core/models/platform-settings.model';
import { NotificationService } from '@app/core/services/notification.service';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent, InviteUserModalComponent],
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss'],
})
export class TeamManagementComponent implements AfterViewInit, OnDestroy {
  @Input() teamMembers: TeamMember[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  private readonly _router = inject(Router);
  private readonly _notificationService = inject(NotificationService);
  private _intersectionObserver?: IntersectionObserver;

  protected readonly showInviteModal = signal(false);
  protected readonly displayedMembers = signal<TeamMember[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly pageSize = 10;
  protected currentPage = 0;

  ngAfterViewInit(): void {
    this._loadInitialMembers();
    this._setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this._intersectionObserver?.disconnect();
  }

  protected openInviteModal(): void {
    this.showInviteModal.set(true);
  }

  protected closeInviteModal(): void {
    this.showInviteModal.set(false);
  }

  protected handleInviteSuccess(): void {
    this.closeInviteModal();
    this._notificationService.success('Admin invited successfully!');
  }

  protected editTeamMember(member: TeamMember): void {
    this._router.navigate(['/admin/profile', member.id]);
  }

  protected toggleMemberStatus(memberId: number): void {
    this._notificationService.success('Member status updated!');
  }

  protected getRoleBadgeClass(role: string): string {
    const roleMap: Record<string, string> = {
      ADMIN: 'badge--admin',
      EDITOR: 'badge--editor',
      VIEWER: 'badge--viewer',
    };
    return roleMap[role] || 'badge--default';
  }

  protected trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  private _loadInitialMembers(): void {
    const initial = this.teamMembers.slice(0, this.pageSize);
    this.displayedMembers.set(initial);
    this.currentPage = 1;
  }

  private _loadMoreMembers(): void {
    if (this.isLoading() || this._hasLoadedAll()) {
      return;
    }

    this.isLoading.set(true);

    // Simulate async loading (replace with actual service call if needed)
    setTimeout(() => {
      const start = this.currentPage * this.pageSize;
      const end = start + this.pageSize;
      const nextBatch = this.teamMembers.slice(start, end);

      if (nextBatch.length > 0) {
        this.displayedMembers.update((current) => [...current, ...nextBatch]);
        this.currentPage++;
      }

      this.isLoading.set(false);
    }, 800); // Increased delay to show loading state
  }

  private _hasLoadedAll(): boolean {
    return this.displayedMembers().length >= this.teamMembers.length;
  }

  private _setupInfiniteScroll(): void {
    const options = {
      root: this.scrollContainer.nativeElement,
      rootMargin: '100px',
      threshold: 0.1,
    };

    this._intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this._loadMoreMembers();
        }
      });
    }, options);

    // Observe the sentinel element
    const sentinel =
      this.scrollContainer.nativeElement.querySelector('.scroll-sentinel');
    if (sentinel) {
      this._intersectionObserver.observe(sentinel);
    }
  }
}
