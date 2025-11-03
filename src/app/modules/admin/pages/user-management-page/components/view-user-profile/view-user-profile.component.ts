import {
  Component,
  EventEmitter,
  Output,
  Input,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalHeaderComponent } from '../../../../../../shared/ui/modal-header/modal-header.component';
import { ButtonComponent } from '../../../../../../shared/ui/button/button.component';
import { User } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule, ModalHeaderComponent, ButtonComponent],
  templateUrl: './view-user-profile.component.html',
  styleUrls: ['./view-user-profile.component.scss'],
})
export class ViewUserProfileComponent {
  @Output() close = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<User>();
  @Input() userData?: User;

  public readonly profileImage = computed(() => {
    return (
      this.userData?.profileImageUrl ||
      this.userData?.avatar ||
      'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128'
    );
  });

  public readonly isActive = computed(() => this.userData?.status === 'Active');

  public readonly statusButtonText = computed(() =>
    this.isActive() ? 'Deactivate User' : 'Activate User'
  );

  public onClose(): void {
    this.close.emit();
  }

  public onToggleStatus(): void {
    if (this.userData) {
      this.toggleStatus.emit(this.userData);
    }
  }

  public getPhoneDisplay(): string {
    return this.userData?.phone || 'N/A';
  }
}
