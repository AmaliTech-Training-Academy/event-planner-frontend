import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { User } from '../../../../../../core/models/user.model';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [
    ModalHeaderComponent,
    ButtonComponent,
    CommonModule,
    NgOptimizedImage,
  ],
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewUserProfileComponent {
  @Output() public close = new EventEmitter<void>();
  @Output() public toggleStatus = new EventEmitter<User>();
  @Output() public save = new EventEmitter<any>();
  @Output() public edit = new EventEmitter<void>();

  public readonly userData = input<User>();
  public readonly isEditMode = signal<boolean>(false);

  protected readonly isActive = computed(() => {
    const status = this.userData()?.status;

    if (typeof status === 'boolean') {
      return status;
    }
    if (typeof status === 'string') {
      return status.toLowerCase() === 'active';
    }

    return false;
  });

  protected readonly statusIcon = computed(() =>
    this.isActive() ? 'icons/power-red.png' : 'icons/power-green.png'
  );

  protected readonly statusButtonText = computed(() =>
    this.isActive() ? 'Deactivate User' : 'Activate User'
  );

  protected readonly profileImage = computed(() => {
    const user = this.userData();
    return (
      user?.profileImageUrl ||
      user?.avatar ||
      'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
    );
  });

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

  public onClose(): void {
    this.close.emit();
  }

  public onEdit(): void {
    this.edit.emit();
  }

  public onCancelEdit(): void {
    this.isEditMode.set(false);
  }

  public onSaveEdit(formData: any): void {
    this.save.emit(formData);
    this.isEditMode.set(false);
  }

  public onToggleStatus(): void {
    const user = this.userData();
    if (user) {
      this.toggleStatus.emit(user);
    }
  }
}
