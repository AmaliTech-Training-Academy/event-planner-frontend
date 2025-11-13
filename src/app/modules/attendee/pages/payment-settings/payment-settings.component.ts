import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { FormErrorComponent } from "../../../../shared/ui/form-error/form-error.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { SwitchComponent } from "../../../../shared/ui/switch/switch.component";
import { PaymentSettings } from './model/payment.model';
import { paymentSetting } from './constant/payment.contant';



@Component({
  selector: 'app-payment-settings-page',
  imports: [ButtonComponent, CommonModule, InputComponent, FormErrorComponent, SwitchComponent, ReactiveFormsModule],
  templateUrl: './payment-settings.component.html',
  styleUrl: './payment-settings.component.scss'
})
export class PaymentSettingsPageComponent implements OnInit {


  protected paymentSettings: PaymentSettings = paymentSetting;

  protected form!: FormGroup;
  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      active_method: new FormControl(null),
      methods: this.fb.array(this.paymentSettings.map(method => this.createMethodForm(method))),
    });

    this.registerHandlers()
  }
  private createMethodForm(method: PaymentSettings[number]): FormGroup {

    const fieldGroups: FormGroup[] = [];

    method.fields.flat().forEach((field) => {
      fieldGroups.push(
        this.fb.group({
          label: field.label,
          type: field.type,
          backend_key: field.backned_key,
          options: [field.options],
          [field.backned_key]: this.fb.control(''),
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

  onToggle(group: FormGroup, state: boolean) {
    console.log("toggle", state)
    group.get('active')?.patchValue(state)
    if (state) {
      this.enableFields(group)
    } else {
      this.disbaleFields(group)
    }
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

  protected onChange(data: any, d: number) {

  }

  onSubmit() {
    console.log(this.form.getRawValue())
  }

}
