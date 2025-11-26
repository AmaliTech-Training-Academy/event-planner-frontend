import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { PAYMENT_TYPES } from './../constant/payment.contant';
export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldAction {
  text: string;
  clickHandler: () => void;
}


export interface FormField {
  label: string;
  type: string;
  options?: SelectOption[];
  action?: FieldAction;
  backend_key: string,
  defaultValue?:string|boolean;
  validators?: (ValidatorFn | AsyncValidatorFn)[];
}


export interface PaymentMethod {
  title: string;
  fields: (FormField[])[];
  active: boolean;
  backend_key: string,
  type: ReturnType<() => PAYMENT_TYPES>;
}


export type PaymentSettings = PaymentMethod[];

