import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '@app/core/services/notification.service';
import { ButtonComponent } from "@app/shared/ui/button/button.component";
import { FormErrorComponent } from "@app/shared/ui/form-error/form-error.component";
import { InputComponent } from "@app/shared/ui/input/input.component";

@Component({
  selector: 'app-edit-ticket-card',
  imports: [CommonModule, ButtonComponent, InputComponent, FormErrorComponent, ReactiveFormsModule],
  templateUrl: './edit-ticket-card.component.html',
  styleUrl: './edit-ticket-card.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditTicketCardComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('slideView', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)', height: 0 }),
        animate(
          '250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)', height: '*' })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)', height: '*' }),
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)', height: 0 })
        )
      ])
    ])
  ]
})

export class EditTicketCardComponent implements OnInit {

  public ticketGroup = input.required<FormGroup>();
  public removeGroup = output<void>()
  public mode = signal<'view' | 'edit'>('view')

  protected deletable = computed<boolean>(() => {
    return this.ticketGroup()?.get('id')?.value === null;
  });

  constructor(private readonly notificationService:NotificationService){}

  ngOnInit() {
    const initialMode = this.ticketGroup()?.get('mode')?.value;
    if (initialMode) {
      this.mode.set(initialMode);
    }

    this.ticketGroup()?.get('mode')?.valueChanges.subscribe((value) => {
      this.mode.set(value)
    });
  }

  protected switchToEdit() {
    this.ticketGroup()?.get('mode')?.setValue('edit')
  }



  protected getError(controlName: string): string | null {
    const control = this.ticketGroup().get(controlName);
    if (!control || !control.errors) return null;

    const [firstKey] = Object.keys(control.errors);
    const error = control.errors[firstKey];

    switch (firstKey) {

      case 'required':
        return 'This field is required';

      case 'minlength':
        return `Minimum length is ${error.requiredLength}`;

      case 'maxlength':
        return `Maximum length is ${error.requiredLength}`;

      case 'min':
        return `Minimum value is ${error.min}`;

      case 'max':
        return `Maximum value is ${error.max}`;

      default:
        return 'Invalid value';
    }
  }


  protected switchToView() {
    const notValid = this.ticketGroup().invalid
    if (notValid && this.ticketGroup().dirty) {
      this.notificationService.error(`Please double check your ticket field`)
      return;
    }
    if (notValid && !this.ticketGroup().dirty){
      this.removeGroup.emit()
      return
    }
    this.ticketGroup()?.get('mode')?.setValue('view')

  }

}
