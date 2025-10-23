import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent implements OnInit {
  protected form: FormGroup;
  checked: boolean = false;


  constructor(private readonly fb: FormBuilder) {
    this.form = fb.group({
      eventType: [EVENT_TYPE.SINGLE_DAY, [Validators.required]],
      dates: this.fb.array([
        
      ]),
      meetingType: [MEETING_TYPE.IN_PERSON, [Validators.required]],
      flyer: ['', Validators.required],
      capacity: [0],
      price: [0],
      percs: ["", Validators.required]

    })
    this.eventDates.push(this.createDateGroup())
    
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

  }

  // protected get eventDates(): FormArray {
  //   return this.form.get('dates') as FormArray;
  // }

  get eventDates(): FormArray<FormGroup> {
  return this.form.get('dates') as FormArray<FormGroup>;
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



  get startDateGroup(): FormGroup {
    return this.eventDates.at(0) as FormGroup;
  }


  get endDateGroup(): FormGroup | null {
    return this.eventDates.length > 1 ? (this.eventDates.at(1) as FormGroup) : null;
  }



  addDateGroup(): void {
    const label = this.eventDates.length === 0 ? 'startsAt' : 'endsAt';
    this.eventDates.push(this.createDateGroup(label));
  }

  removeDateGroup(index: number): void {
    this.eventDates.removeAt(index);
  }

  getDateControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }



  onToggle() {

  }

}
