import { Component, input, Input, signal } from '@angular/core';

@Component({
  selector: 'app-secure-text',
  standalone: true,
  templateUrl: './secure-text.component.html',
  styleUrls: ['./secure-text.component.scss'],
})
export class SecureTextComponent {
  public text = input<string>('Secure login enabled');
  public subText = input<string>('This is a secure, encrypted connection');
  public iconSrc = input<string>('assets/icons/lock.svg');
}
