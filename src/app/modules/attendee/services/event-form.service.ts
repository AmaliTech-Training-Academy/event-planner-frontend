import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EVENT_TYPE, MEETING_TYPE, PRICE_TYPE } from '../constants/event-form.constant';
import { EVENT_FORM_FIELDS as F } from '../constants/event-form.constant';


@Injectable({ providedIn: 'root' })
export class EventFormService {
  private form: FormGroup;
  private subscription = new Subscription();

    constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      [F.EVENT_TYPE]: [EVENT_TYPE.SINGLE_DAY, [Validators.required]],
      [F.DATES]: this.fb.array([]),
      [F.MEETING_TYPE]: [MEETING_TYPE.IN_PERSON, [Validators.required]],
      [F.FLYER]: ['', Validators.required],
      [F.TITLE]: ['', Validators.required],
      [F.CAPACITY]: [0],
      [F.PRICE]: [0],
      [F.PERCS]: ['', Validators.required],
      [F.REQUIRE_APPROVAL]: [false, Validators.required],
      [F.PRICE_TYPE]: [PRICE_TYPE.FREE, Validators.required],
    });

    this.eventDates.push(this.createDateGroup());
    this.form.addControl(F.IN_PERSON_DETAILS, this.createInPersonDetailGroup());
  }
  
  public getForm(): FormGroup {
    return this.form;
  }

  public get eventDates(): FormArray<FormGroup> {
    return this.form.get(F.DATES) as FormArray<FormGroup>;
  }

  public get meetingType() {
    return this.form.get(F.MEETING_TYPE);
  }

  public get capacity() {
    return this.form.get(F.CAPACITY);
  }

  public get price() {
    return this.form.get(F.PRICE);
  }
  public get flyer() {
    return this.form.get(F.FLYER);
  }

  public get inPersonDetails() {
    return this.form.get(F.IN_PERSON_DETAILS) as FormGroup;
  }

  public get requireApproval() {
    return this.form.get(F.REQUIRE_APPROVAL);
  }

  public get venueImages() {
    return this.inPersonDetails.get(F.IMAGES);
  }

  private createDateGroup(label?: 'startsAt' | 'endsAt'): FormGroup {
    return this.fb.group({
      [F.LABEL]: [label || 'startsAt'],
      [F.DATE]: ['', Validators.required],
      [F.TIME]: ['', Validators.required],
      [F.TIME_ZONE]: ['', Validators.required],
    });
  }

  private createVirtualDetailGroup(): FormGroup {
    return this.fb.group({
      [F.MEETING_LINK]: ['', Validators.required],
    });
  }

  private createInPersonDetailGroup(): FormGroup {
    return this.fb.group({
      [F.LOCATION]: ['', Validators.required],
      [F.DESCRIPTION]: ['', Validators.required],
      [F.IMAGES]: [[]],
    });
  }



  public registerValueChangeHandlers() {
    const eventTypeSub = this.form.get(F.EVENT_TYPE)?.valueChanges.subscribe((type) => {
      if (type === EVENT_TYPE.MULTI_DAY && this.eventDates.length < 2) {
        this.addDateGroup();
      } else if (type === EVENT_TYPE.SINGLE_DAY && this.eventDates.length > 1) {
        const startData = this.eventDates.at(0).value;
        this.eventDates.clear();
        this.eventDates.push(this.fb.group(startData));
      }
    });

    const meetingTypeSub = this.meetingType?.valueChanges.subscribe((type) => {
      this.form.removeControl(F.VIRTUAL_DETAILS);
      this.form.removeControl(F.IN_PERSON_DETAILS);

      if (type === MEETING_TYPE.IN_PERSON) {
        this.form.addControl(F.IN_PERSON_DETAILS, this.createInPersonDetailGroup());
      } else if (type === MEETING_TYPE.VIRTUAL) {
        this.form.addControl(F.VIRTUAL_DETAILS, this.createVirtualDetailGroup());
      }
    });

    const priceTypeSub = this.form.get(F.PRICE_TYPE)?.valueChanges.subscribe((type) => {
      const priceControl = this.form.get(F.PRICE);
      const includedControl = this.form.get(F.PERCS);

      if (type === 'free') {
        priceControl?.setValue(0);
        priceControl?.disable({ emitEvent: false });
        includedControl?.disable({ emitEvent: false });
      } else {
        priceControl?.enable({ emitEvent: false });
        includedControl?.enable({ emitEvent: false });
      }
    });


    this.form.get(F.PRICE_TYPE)?.setValue(PRICE_TYPE.FREE);


    this.subscription.add(eventTypeSub);
    this.subscription.add(meetingTypeSub);
    this.subscription.add(priceTypeSub);
  }

  private addDateGroup(): void {
    const label = this.eventDates.length === 0 ? 'startsAt' : 'endsAt';
    this.eventDates.push(this.createDateGroup(label));
  }

  public removeDateGroup(index: number): void {
    this.eventDates.removeAt(index);
  }

  public resetForm(): void {
    this.form.reset();
  }


  public destroy() {
    this.subscription.unsubscribe();
  }

  public getDateControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }

  public getImageSrc(image: any): string {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  }


  public controlValueChanged(control: AbstractControl | null): void {
    if (control) {
      control.markAsDirty();
      control.markAsTouched();
    }
  }
}