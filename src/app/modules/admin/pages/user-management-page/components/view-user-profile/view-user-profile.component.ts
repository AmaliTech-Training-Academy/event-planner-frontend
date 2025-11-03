import {
  Component,
  EventEmitter,
  Output,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { User } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [ModalHeaderComponent, ButtonComponent],
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewUserProfileComponent {
  // Public - accessed by parent
  @Output() public close = new EventEmitter<void>();
  @Output() public toggleStatus = new EventEmitter<User>();
  public readonly userData = input<User>();
  protected readonly statusIcon = computed(() =>
    this.isActive()
      ? 'icons/camera.png'
      : 'icons/camera.png'
  );
  // Protected - used only in template
  protected readonly profileImage = computed(() => {
    const user = this.userData();
    return (
      user?.profileImageUrl ||
      user?.avatar ||
      'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
    );
  });

  protected readonly isActive = computed(
    () => this.userData()?.status === 'Active'
  );

  protected readonly statusButtonText = computed(() =>
    this.isActive() ? 'Deactivate User' : 'Activate User'
  );

  protected readonly phoneDisplay = computed(
    () => this.userData()?.phone || 'N/A'
  );

  protected readonly fullName = computed(
    () => this.userData()?.fullName || 'N/A'
  );

  protected readonly email = computed(() => this.userData()?.email || 'N/A');

  protected readonly address = computed(
    () => this.userData()?.address || 'N/A'
  );

  // Public - called from template via event binding
  public onClose(): void {
    this.close.emit();
  }

  public onToggleStatus(): void {
    const user = this.userData();
    if (user) {
      this.toggleStatus.emit(user);
    }
  }
}
