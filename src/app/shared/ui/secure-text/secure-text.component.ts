import { Component, input } from '@angular/core';

@Component({
  selector: 'app-secure-text',
  standalone: true,
  templateUrl: './secure-text.component.html',
  styleUrls: ['./secure-text.component.scss'],
})
export class SecureTextComponent {
  public main = input<string>('Secure login enabled');
  public sub = input<string>('This is a secure, encrypted connection');
  public iconSrc = input<string>('icons/info.svg');
}
