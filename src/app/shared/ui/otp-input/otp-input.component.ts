import {
  Component,
  QueryList,
  ViewChildren,
  ElementRef,
  signal,
  Input, 
  Output, 
  EventEmitter, 
  OnInit, 
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
  
  
  @Input() length: number = 6; 

  
  @Output() otpChange = new EventEmitter<string>();

 
  protected otpDigits = signal<string[]>([]);

  
  @ViewChildren('otpInput') private inputs?: QueryList<
    ElementRef<HTMLInputElement>
  >;

  
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

    
    const nextIndex = Math.min(digits.length, this.length - 1);
    this.inputs?.toArray()[nextIndex]?.nativeElement.focus();
    
   
    this.otpChange.emit(this.getOtpValue());
  }

  protected getOtpValue(): string {
    return this.otpDigits().join('');
  }
}