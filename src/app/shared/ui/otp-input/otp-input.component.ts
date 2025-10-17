import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OtpInputComponent {
  otpDigits: string[] = new Array(6).fill('');

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpDigits[index] = value;

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Move to previous input on backspace if current is empty
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain').trim() || '';

    // Only process if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split('');
    digits.forEach((digit, index) => {
      if (index < 6) {
        this.otpDigits[index] = digit;
      }
    });

    // Focus the appropriate input
    const inputs = document.querySelectorAll(
      '.otp-input'
    ) as NodeListOf<HTMLInputElement>;
    const nextIndex = Math.min(digits.length, 5);
    inputs[nextIndex]?.focus();
  }

  getOtpValue(): string {
    return this.otpDigits.join('');
  }
}
