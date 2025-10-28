import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalContainerComponent } from "../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { EventDatePickerComponent } from "../../components/event-date-picker/event-date-picker.component";
import { EventTimePickerComponent } from "../../components/event-time-picker/event-time-picker.component";
import { EventTimeZonePickerComponent } from "../../components/event-time-zone-picker/event-time-zone-picker.component";

const EVENT_TYPE = {
  SINGLE_DAY: 'day',
  MULTI_DAY: 'multi-day',
}
const MEETING_TYPE = {
  VIRTUAL: 'virtual',
  IN_PERSON: 'in-person',
}

@Component({
  selector: 'app-create-event-page',
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent, ReactiveFormsModule, CommonModule, ModalContainerComponent, InputComponent, ButtonComponent],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent implements OnInit {
  protected form: FormGroup;
  protected checked: boolean = false;
  protected flyerPreview: string | null = null;
  protected showPriceModal: boolean = false;
  protected showCapacityModal: boolean = false;


  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      eventType: [EVENT_TYPE.SINGLE_DAY, [Validators.required]],
      dates: this.fb.array([]),
      meetingType: [MEETING_TYPE.IN_PERSON, [Validators.required]],
      flyer: ['', Validators.required],
      title: ['', Validators.required],
      capacity: [0],
      price: [0],
      percs: ["", Validators.required],
      requireApproval: [false, Validators.required],
      priceType: ['free', Validators.required],
    })
    this.eventDates.push(this.createDateGroup())
    this.form.addControl('inPersonDetails', this.createInPersonDetailGroup());

  }


  ngOnInit(): void {

    this.form.get('eventType')?.valueChanges.subscribe((type) => {
      if (type === EVENT_TYPE.MULTI_DAY && this.eventDates.length < 2) {
        this.addDateGroup();
      }
      else if (type === EVENT_TYPE.SINGLE_DAY && this.eventDates.length > 1) {
        const startData = this.eventDates.at(0).value;
        this.eventDates.clear();
        this.eventDates.push(this.fb.group(startData));
      }
    });


    this.meetingType?.valueChanges.subscribe((type) => {
      this.form.removeControl('virtualDetails');
      this.form.removeControl('inPersonDetails');

      if (type === MEETING_TYPE.IN_PERSON) {
        this.form.addControl('inPersonDetails', this.createInPersonDetailGroup());
      }
      else if (type === MEETING_TYPE.VIRTUAL) {
        this.form.addControl('virtualDetails', this.createVirtualDetailGroup());
      }
    })

    this.form.get('priceType')?.valueChanges.subscribe((type) => {
      const priceControl = this.form.get('price');
      const includedControl = this.form.get('percs');

      if (type === 'free') {
        priceControl?.disable({ emitEvent: false });
        includedControl?.disable({ emitEvent: false });
      } else {
        priceControl?.enable({ emitEvent: false });
        includedControl?.enable({ emitEvent: false });
      }
    });

  }

  togglePriging() {

  }

  protected onVenueImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const files = Array.from(input.files);

    const currentImages = this.inPersonDetails.get('images')?.value || [];

    const updatedImages = [...currentImages, ...files].slice(0, 5);

    this.inPersonDetails.get('images')?.setValue(updatedImages);
    this.inPersonDetails.get('images')?.markAsDirty();

  }

  protected onFlyerImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    this.form.get('flyer')?.setValue(file);
    this.form.get('flyer')?.markAsDirty();

    this.flyerPreview = URL.createObjectURL(file);
  }

  // protected get eventDates(): FormArray {
  //   return this.form.get('dates') as FormArray;
  // }


  protected get eventDates(): FormArray<FormGroup> {
    return this.form.get('dates') as FormArray<FormGroup>;
  }

  protected get inPersonDetails() {
    return this.form.get('inPersonDetails') as FormGroup;
  }

  protected get meetingType() {
    return this.form.get('meetingType')
  }

  private createDateGroup(label?: 'startsAt' | 'endsAt'): FormGroup {
    return this.fb.group({
      label: [label || 'startsAt'],
      date: ['', Validators.required],
      time: ['', Validators.required],
      timeZone: ['', Validators.required],
    });
  }

  private createVirtualDetailGroup() {

    return this.fb.group({
      meetingLink: ['', Validators.required]
    })

  }

  private createInPersonDetailGroup() {

    return this.fb.group({
      location: ['', Validators.required],
      description: ['', Validators.required],
      images: [[]],
    })

  }



  private get startDateGroup(): FormGroup {
    return this.eventDates.at(0) as FormGroup;
  }


  private get endDateGroup(): FormGroup | null {
    return this.eventDates.length > 1 ? (this.eventDates.at(1) as FormGroup) : null;
  }



  private addDateGroup(): void {
    const label = this.eventDates.length === 0 ? 'startsAt' : 'endsAt';
    this.eventDates.push(this.createDateGroup(label));
  }

  private removeDateGroup(index: number): void {
    this.eventDates.removeAt(index);
  }

  protected getDateControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }


  protected getImageSrc(image: any): string {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  }

  protected togglePriceModal() {
    this.showPriceModal = !this.showPriceModal;
  }
  protected toggleCapacityModal() {
    this.showCapacityModal = !this.showCapacityModal;
  }

  protected onToggle() {
    this.checked = !this.checked;
    this.form.get('requireApproval')?.setValue(this.checked);
    this.form.get('requireApproval')?.markAsTouched();
    this.form.get('requireApproval')?.markAsDirty();
  }


  protected removeCapacityLimit(){
    this.form.get('capacity')?.setValue(0);
    this.form.get('capacity')?.markAsDirty();
    this.form.get('capacity')?.markAllAsTouched();
  }

  setCapacityLimit(){
    this.form.get('capacity')?.markAsDirty();
    this.form.get('capacity')?.markAllAsTouched();
  }

}
