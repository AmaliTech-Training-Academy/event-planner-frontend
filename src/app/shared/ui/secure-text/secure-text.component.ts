import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-secure-text',
  standalone: true,
  templateUrl: './secure-text.component.html',
  styleUrls: ['./secure-text.component.scss'],
})
export class SecureTextComponent {
  @Input() text: string = 'Secure login enabled';
  @Input() subText: string = 'This is a secure, encrypted connection';
  @Input() iconSrc: string = 'assets/icons/lock.svg'; // path to the lock image
}
