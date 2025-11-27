import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BankInformation, MoMoInformation, PaymentAnalytics, withdrawRequest } from '@app/core/models/payment.model';
import { NotificationService } from '@app/core/services/notification.service';
import { PaymentService } from '@app/core/services/payment.service';
import { Subscription } from 'rxjs';
import { UserCardData } from '../../../../core/models';
import { AdminUserCardComponent } from "../../../../shared/admin-ui/admin-user-card/admin-user-card.component";
import { ModalContainerComponent } from "../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { FormErrorComponent } from "../../../../shared/ui/form-error/form-error.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { SwitchComponent } from "../../../../shared/ui/switch/switch.component";
import { MY_EVENT_STAT_CARDS, PAYMENT_TYPES, paymentSetting } from './constant/payment.contant';
import { FormField, PaymentSettings } from './model/payment.model';

@Component({
  selector: 'app-payment-settings-page',
  imports: [ButtonComponent, CommonModule, InputComponent, FormErrorComponent, SwitchComponent, ReactiveFormsModule, AdminUserCardComponent,  ModalContainerComponent],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss'
})
export class PaymentSettingsPageComponent implements OnInit, OnDestroy {

  protected analytics = signal<UserCardData[]>(MY_EVENT_STAT_CARDS);
  protected paymentSettings: PaymentSettings = paymentSetting;
  protected showPayoutModal = signal<boolean>(false)
  protected payoutAmount = signal<number>(0.00);
  protected loading = signal<boolean>(true)
  private subscription = new Subscription()

  protected form!: FormGroup;

  protected maxPayoutAmount = computed<number>(() => {
    const analyticsData = this.analytics();
    const totalEarningsCard = analyticsData.find(card => card.backend_key === 'outstandingBalance');
    return totalEarningsCard ? totalEarningsCard.count : 0;
  });

  constructor(private readonly fb: FormBuilder, private readonly paymentService: PaymentService, private readonly notificationService: NotificationService) { }


  ngOnInit() {

    this.subscription.add(this.paymentService.loading$.subscribe({
      next: (value) => {
        this.loading.set(value);
      }
    })
    )

    this.paymentService.getPaymentInfo().subscribe({
      next: (response) => {
        const paymentData = response.stats.data as PaymentAnalytics;
        const MoMoData = response.momo.data as MoMoInformation;
        const bankData = response.bank.data as BankInformation;

        this.paymentSettings.forEach(methods => {

          if (methods.type === PAYMENT_TYPES.BANK) {

            methods.fields = methods.fields.map(row => {
              row.forEach((field: FormField) => {
                field.defaultValue = bankData[field.backend_key as keyof BankInformation] ?? '';
              });
              return row;
            });

          } else if (methods.type === PAYMENT_TYPES.MoMo) {

            methods.fields = methods.fields.map(row => {
              row.forEach((field: FormField) => {
                field.defaultValue = MoMoData[field.backend_key as keyof MoMoInformation] ?? '';
              });
              return row;
            });

          }

        });

        this.buildFrom();

        this.analytics.set(
          this.analytics().map((card: UserCardData,) => {
            const key = card.backend_key as keyof PaymentAnalytics;

            card.count = paymentData[key]

            return card as UserCardData;
          }))

        
      }
    })

   

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  private buildFrom() {
    this.form = this.fb.group({
      active_method: new FormControl(null, Validators.required),
      methods: this.fb.array(this.paymentSettings.map(method => this.createMethodForm(method))),
    });

    this.registerHandlers()
  }

  protected showPayoutModalToggle() {
    if (this.loading()) return;
    this.showPayoutModal.update(prev => !prev)
  }

  private createMethodForm(method: PaymentSettings[number]): FormGroup {

    const fieldGroups: FormGroup[] = [];

    method.fields.flat().forEach((field) => {
      fieldGroups.push(
        this.fb.group({
          label: field.label,
          type: field.type,
          backend_key: field.backend_key,
          options: [field.options],
          [field.backend_key]: this.fb.control(field.defaultValue || '', field.validators),
        })
      );
    });

    return this.fb.group({
      type: method.type,
      title: method.title,
      active: this.fb.control(false),
      fields: this.fb.array(fieldGroups),
    });
  }


  protected get methods(): FormArray<FormGroup> {
    return this.form.get('methods') as FormArray<FormGroup>;
  }


  protected methodFields(group: FormGroup) {
    return group.get('fields') as FormArray<FormGroup>
  }


  protected get activeMethodControl() {
    return this.form.get('active_method')
  }

  protected onToggle(selectedGroup: FormGroup, state: boolean) {
    if (state) {

      this.methods.controls.forEach(group => {
        if (group !== selectedGroup) {
          group.get('active')?.patchValue(false);
          this.disbaleFields(group);
        }
      });


      selectedGroup.get('active')?.patchValue(true);
      this.enableFields(selectedGroup);

      this.form.get('active_method')?.patchValue(selectedGroup.get('type')?.value)

    } else {
      this.form.get('active_method')?.patchValue(null)
      selectedGroup.get('active')?.patchValue(false);
      this.disbaleFields(selectedGroup);
    }
  }

  protected getError(selectedGroup: FormGroup, key: string): string | null {
    const control = selectedGroup.get(key);

    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Invalid email format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength'])
      return `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['pattern']) return 'Invalid format';

    return 'Invalid field';
  }

  private registerHandlers() {
    this.methods.controls.forEach(group => {
      const isActive = group.get('active')?.value;
      if (!isActive) this.disbaleFields(group);
    });
  }

  private disbaleFields(group: FormGroup) {
    const fields = group.get('fields') as FormArray<FormGroup>

    fields.controls.forEach(fieldGroup => {
      const controlName = fieldGroup.get('backend_key')?.value
      fieldGroup.get(controlName)?.disable()
    });
  }

  private enableFields(group: FormGroup) {
    const fields = group.get('fields') as FormArray<FormGroup>

    fields.controls.forEach(fieldGroup => {
      const controlName = fieldGroup.get('backend_key')?.value
      fieldGroup.get(controlName)?.enable()
    });
  }

  protected withdrawAmountChange(amount: string) {
    this.payoutAmount.set(parseFloat(amount));
  }

  protected getWithdrawErro() {
    if (this.payoutAmount() > this.maxPayoutAmount()) {
      return `Your available balance is $${this.maxPayoutAmount().toPrecision(2)}`
    }
    return null
  }

  protected withdrawFund() {
    if (!this.payoutAmount() || this.payoutAmount() <= 0 || this.payoutAmount() > this.maxPayoutAmount() || this.loading()) {
      this.notificationService.error(`Kindly review your withdraw amount`)
      return
    }

    this.onSubmit()

    let data: withdrawRequest = {} as withdrawRequest;
    const activeMethodType = this.form.get('active_method')?.value;
    const activeMethodGroup = this.methods.controls.find(group => group.get('type')?.value === activeMethodType);

    data.withdrawalMethod = activeMethodType === PAYMENT_TYPES.BANK ? 'BANK' : 'MOBILE_MONEY';

    const fieldsArray = activeMethodGroup?.get('fields') as FormArray<FormGroup>;
    fieldsArray.controls.forEach(fieldGroup => {
      const key = fieldGroup.get('backend_key')?.value;
      const value = fieldGroup.get(key)?.value;

      if (key === 'accountNumber' || key === 'mobileMoneyNumber') {
        data.accountNumber = value;
      } else if (key === 'accountHolderName') {
        data.accountName = value;
      } else if (key === 'networkOperator' || key === 'bankName') {
        data.provider = value;
      }
    });

    data.amount = this.payoutAmount();

    this.paymentService.withdrawFunds(data).subscribe({
      next: () => {

      },
      complete: () => {
        this.notificationService.success(`Withdraw request successfull`)
      }
    })

  }

  protected onSubmit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const activeMethodType = this.form.get('active_method')?.value;
    const activeMethodGroup = this.methods.controls.find(group => group.get('type')?.value === activeMethodType);


    let action: "Create" | "Update" = "Create";

    this.paymentSettings.some(method => {
      if (method.type === activeMethodType) {
        const hasDefaults = method.fields.some(field =>
          field.some(f => f.defaultValue)
        );

        if (hasDefaults) {
          action = "Update";
        }

        return true;
      }

      return false;
    });

    if (!activeMethodGroup) {
      return;
    }

    const fieldsArray = activeMethodGroup.get('fields') as FormArray<FormGroup>;
    const payload: any = {};

    fieldsArray.controls.forEach(fieldGroup => {
      const key = fieldGroup.get('backend_key')?.value;
      const value = fieldGroup.get(key)?.value;
      payload[key] = value;
    });

    this.paymentService.updatePaymentInfo(activeMethodType, payload, action).subscribe({
      complete: () => {
        this.notificationService.success(`Payment information updated successfully`)
      }
    });

  }
}