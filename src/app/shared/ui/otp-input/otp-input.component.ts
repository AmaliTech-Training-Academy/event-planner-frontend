import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  signal,
  Input, // ADDED: For length
  Output, // ADDED: For events
  EventEmitter, // ADDED: For events
  OnInit, // ADDED: For initialization logic
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OtpInputComponent implements OnInit {
  
  // 1. INPUT: Receives the length from the parent component
  @Input() length: number = 6; 

  // 2. OUTPUT: Emits the full OTP string whenever any digit changes
  @Output() otpChange = new EventEmitter<string>();

  // Internal state is now dynamically sized based on @Input() length
  protected otpDigits = signal<string[]>([]);

  // View Children access (kept private as best practice)
  @ViewChildren('otpInput') private inputs?: QueryList<
    ElementRef<HTMLInputElement>
  >;

  // Initialize the signal array based on the input length
  ngOnInit(): void {
    this.otpDigits.set(new Array(this.length).fill(''));
  }
  
  protected get digits(): string[] {
    return this.otpDigits();
  }

  protected onInput(event: Event, index: number): void {
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

    // 3. EMIT: Emit the full OTP value to the parent component
    this.otpChange.emit(this.getOtpValue());

    if (value && index < this.length - 1) {
      this.inputs?.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  protected onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      this.inputs?.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain')?.trim() ?? '';

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, this.length).split('');
    this.otpDigits.update((arr) => {
      digits.forEach((digit, i) => {
        if (i < this.length) arr[i] = digit;
      });
      return arr;
    });

    // Focus on the next logical input after pasting
    const nextIndex = Math.min(digits.length, this.length - 1);
    this.inputs?.toArray()[nextIndex]?.nativeElement.focus();
    
    // 3. EMIT: Emit the full OTP value after pasting
    this.otpChange.emit(this.getOtpValue());
  }

  protected getOtpValue(): string {
    return this.otpDigits().join('');
  }
}