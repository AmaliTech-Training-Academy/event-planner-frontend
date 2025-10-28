import { FormArray, FormGroup } from "@angular/forms";

export interface TimeZone{
    gmt:string,
    name:string
}

export type EventPriceType = 'free' | 'paid';
