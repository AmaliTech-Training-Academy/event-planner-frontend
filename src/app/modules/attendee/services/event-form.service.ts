import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EVENT_TYPE, EVENT_FORM_FIELDS as F, MEETING_TYPE, PRICE_TYPE } from '../constants/event-form.constant';


@Injectable({ providedIn: 'root' })
export class EventFormService {
  private form: FormGroup;
  private destroy$ = new Subject<void>();
  private objectUrlCache = new WeakMap<File, string>();

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      [F.EVENT_TYPE]: [EVENT_TYPE.SINGLE_DAY, [Validators.required]],
      [F.DATES]: this.fb.array([]),
      [F.MEETING_TYPE]: [MEETING_TYPE.IN_PERSON, [Validators.required]],
      [F.FLYER]: ['', Validators.required],
      [F.TITLE]: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      [F.CAPACITY]: [0, [Validators.min(0)]],
      [F.PRICE]: [0, [Validators.min(0)]],
      [F.PERCS]: ['', [Validators.required, Validators.minLength(3)]],
      [F.REQUIRE_APPROVAL]: [false, Validators.required],
      [F.PRICE_TYPE]: [PRICE_TYPE.FREE, Validators.required],
      [F.VENUE_SECTIONS]: this.fb.array([]),
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

  private createDateGroup(label?: 'start' | 'end'): FormGroup {
    return this.fb.group({
      [F.LABEL]: [label || 'startsAt'],
      [F.DATE]: ['', Validators.required],
      [F.TIME]: ['', Validators.required],
      [F.TIME_ZONE]: ['', Validators.required],
    });
  }

  private createVirtualDetailGroup(): FormGroup {
    return this.fb.group({
      [F.MEETING_LINK]: [
        '',
        [
          Validators.required,
          Validators.pattern(
            // Basic URL pattern (http/https)
            /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!$&'\(\)\*\+,;=.]+$/
          ),
        ],
      ],
    });
  }

  private createInPersonDetailGroup(): FormGroup {
    return this.fb.group({
      [F.LOCATION]: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      [F.DESCRIPTION]: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      [F.IMAGES]: [[], Validators.maxLength(5)],
    });
  }


  public addVenueSection(name:string,capacity:number,price:number,description:string,color:string,image:File){
    const newGroup = this.fb.group({
      [F.VENUE_SECTION_NAME]: [name, Validators.required],
      [F.VENUE_SECTION_CAPACITY]: [capacity, Validators.required],
      [F.VENUE_SECTION_PRICE]: [price, Validators.required],
      [F.VENUE_SECTION_DESCRIPTION]: [description, Validators.required],
      [F.VENUE_SECTION_COLOR]: [color, Validators.required],
      [F.VENUE_SECTION_IMAGE]: [image, Validators.required],
    });
    const sections = this.form.get(F.VENUE_SECTIONS) as FormArray;
    sections.push(newGroup);
  }



  public registerValueChangeHandlers() {
    this.form.get(F.EVENT_TYPE)?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        if (type === EVENT_TYPE.MULTI_DAY && this.eventDates.length < 2) {
          this.addDateGroup();
        } else if (type === EVENT_TYPE.SINGLE_DAY && this.eventDates.length > 1) {
          const startData = this.eventDates.at(0).value;
          this.eventDates.clear();
          this.eventDates.push(this.fb.group(startData));
        }
      });

    this.meetingType?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.form.removeControl(F.VIRTUAL_DETAILS);
        this.form.removeControl(F.IN_PERSON_DETAILS);

        if (type === MEETING_TYPE.IN_PERSON) {
          this.form.addControl(F.IN_PERSON_DETAILS, this.createInPersonDetailGroup());
        } else if (type === MEETING_TYPE.VIRTUAL) {
          this.form.addControl(F.VIRTUAL_DETAILS, this.createVirtualDetailGroup());
        }
      });

    this.form.get(F.PRICE_TYPE)?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        const priceControl = this.form.get(F.PRICE);
        const includedControl = this.form.get(F.PERCS);

        if (type === PRICE_TYPE.FREE) {
          priceControl?.setValue(0,{emitEvent: false});
          priceControl?.disable({ emitEvent: false });
          includedControl?.setValue('',{emitEvent: false});
          includedControl?.disable({ emitEvent: false });
        } else {
          priceControl?.enable({ emitEvent: false });
          includedControl?.enable({ emitEvent: false });
        }
      });

      const currentPriceType = this.form.get(F.PRICE_TYPE)?.value;

      if(!currentPriceType) {
        this.form.get(F.PRICE_TYPE)?.setValue(PRICE_TYPE.FREE);
      }else{
        this.form.get(F.PRICE_TYPE)?.setValue(currentPriceType);
      }

  }

  private addDateGroup(): void {
    const label = this.eventDates.length === 0 ? 'start' : 'end';
    this.eventDates.push(this.createDateGroup(label));
  }

  public removeDateGroup(index: number): void {
    this.eventDates.removeAt(index);
  }

  public resetForm(): void {
    this.form.reset();
  }

  public destroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getDateControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }

  public getImageSrc(image: any): string {
    if (image instanceof File) {
      const cached = this.objectUrlCache.get(image);
      if (cached) return cached;
      const url = URL.createObjectURL(image);
      this.objectUrlCache.set(image, url);
      return url;
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