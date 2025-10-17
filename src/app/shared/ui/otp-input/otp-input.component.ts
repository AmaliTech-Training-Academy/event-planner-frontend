import { CommonModule } from '@angular/common';
import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OtpInputComponent {
  public otpDigits = signal<string[]>(new Array(6).fill(''));

  public get digits(): string[] {
    return this.otpDigits();
  }

  @ViewChildren('otpInput') private inputs?: QueryList<
    ElementRef<HTMLInputElement>
  >;

  public onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpDigits.update((digits) => {
      digits[index] = value;
      return digits;
    });

    if (value && index < 5) {
      this.inputs?.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  public onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      this.inputs?.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  public onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain')?.trim() ?? '';

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    this.otpDigits.update((arr) => {
      digits.forEach((digit, i) => {
        if (i < 6) arr[i] = digit;
      });
      return arr;
    });

    const nextIndex = Math.min(digits.length, 5);
    this.inputs?.toArray()[nextIndex]?.nativeElement.focus();
  }

  public getOtpValue(): string {
    return this.otpDigits().join('');
  }
}
