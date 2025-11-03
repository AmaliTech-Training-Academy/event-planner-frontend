import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-secure-text',
  standalone: true,
  templateUrl: './secure-text.component.html',
  styleUrls: ['./secure-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecureTextComponent {
  public readonly text = input<string>('Secure login enabled');
  public readonly subText = input<string>(
    'This is a secure, encrypted connection'
  );
  public readonly iconSrc = input<string>('icons/info.svg');
}
