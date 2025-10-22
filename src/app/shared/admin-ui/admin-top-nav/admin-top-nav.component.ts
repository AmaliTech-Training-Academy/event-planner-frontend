import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-top-nav.component.html',
  styleUrls: ['./admin-top-nav.component.scss'],
})
export class AdminTopNavComponent {
  private readonly _pageTitle = signal<string>('');
  @Input() public set pageTitle(value: string) {
    this._pageTitle.set(value);
  }

  private readonly _notificationsCount = signal<number>(0);
  @Input() public set notificationsCount(value: number) {
    this._notificationsCount.set(value);
  }

  private readonly _userName = signal<string>('');
  @Input() public set userName(value: string) {
    this._userName.set(value);
  }

  private readonly _avatarSrc = signal<string>('');
  @Input() public set avatarSrc(value: string) {
    this._avatarSrc.set(value);
  }

  private readonly _logoSrc = signal<string>('icons/users-icon.png');
  @Input() public set logoSrc(value: string) {
    this._logoSrc.set(value);
  }

  private readonly _logoAlt = signal<string>('Logo');
  @Input() public set logoAlt(value: string) {
    this._logoAlt.set(value);
  }

  public readonly hasNotifications = computed(
    () => this._notificationsCount() > 0
  );
  public readonly pageTitleSig = computed(() => this._pageTitle());
  public readonly notificationsCountSig = computed(() =>
    this._notificationsCount()
  );
  public readonly userNameSig = computed(() => this._userName());
  public readonly avatarSrcSig = computed(() => this._avatarSrc());
  public readonly logoSrcSig = computed(() => this._logoSrc());
  public readonly logoAltSig = computed(() => this._logoAlt());
}
