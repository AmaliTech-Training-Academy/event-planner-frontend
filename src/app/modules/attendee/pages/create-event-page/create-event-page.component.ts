import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { EventsServiceService } from '../../../../core/services/events.service';
import { LocationSearchComponent } from '../../../../shared/components/location-search/location-search.component';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { FormErrorComponent } from '../../../../shared/ui/form-error/form-error.component';
import { RadioButtonComponent } from "../../../../shared/ui/radio-button/radio-button.component";
import { getControlError } from '../../../../shared/utils/form-error.util';
import { EventDatePickerComponent } from "../../components/event-date-picker/event-date-picker.component";
import { EventTimePickerComponent } from "../../components/event-time-picker/event-time-picker.component";
import { EventTimeZonePickerComponent } from "../../components/event-time-zone-picker/event-time-zone-picker.component";
import { EventFormService } from '../../services/event-form.service';
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from './../../constants/event-form.constant';
import { ConnectZoomModalComponent } from "./components/connect-zoom-modal/connect-zoom-modal.component";
import { EventOptionsContainerComponent } from "./components/event-options-container/event-options-container.component";
import { SetCapacityModalComponent } from "./components/set-capacity-modal/set-capacity-modal.component";
import { SetPriceModalComponent } from "./components/set-price-modal/set-price-modal.component";
import { UploadEventFlyerComponent } from "./components/upload-event-flyer/upload-event-flyer.component";
import { NotificationService } from '../../../../core/services/notification.service';
import { EventType, MeetingType } from '../../../../core/models/event.model';
import { Subscription } from 'rxjs';
import { InputComponent } from "@app/shared/ui/input/input.component";


@Component({
  selector: 'app-create-event-page',
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent, ReactiveFormsModule, CommonModule, ButtonComponent, RadioButtonComponent, SetPriceModalComponent, SetCapacityModalComponent, ConnectZoomModalComponent, UploadEventFlyerComponent, EventOptionsContainerComponent, RouterLink, NgOptimizedImage, FormErrorComponent, LocationSearchComponent, InputComponent],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss'
})
export class CreateEventPageComponent implements OnInit, OnDestroy {

  protected form: FormGroup;
  protected checked: boolean = false;
  protected flyerPreview: string | null = null;
  protected showPriceModal: boolean = false;
  protected showCapacityModal: boolean = false;
  protected connectZoomModal: boolean = false;
  protected readonly EVENT_FORM_FIELDS = FIELDS;
  protected readonly MEETING_TYPES = MEETING_TYPE;
  protected readonly EVENT_TYPES = EVENT_TYPE;
  protected readonly APP_ROUTE = APP_ROUTES;
  protected readonly getError = getControlError;
  protected backendEventTypes: EventType[] = []
  protected backendMeetingTypes: MeetingType[] = []
  protected loading: boolean = false;
  private subscription: Subscription = new Subscription();

  private eventId: number = 0

  constructor(private readonly eventFormService: EventFormService, private readonly eventService: EventsServiceService, private readonly notificationService: NotificationService, private readonly router: Router) {

    this.eventId = this.router.getCurrentNavigation()?.extras.state?.['eventId'];
    console.log(this.eventId);

    
    this.form = this.eventFormService.getForm();
    this.checked = this.eventFormService.requireApproval?.value;


    this.eventService.meetingTypes().subscribe({
      next: (meeting_types) => {
        this.backendMeetingTypes = meeting_types
      },
    })

    this.eventService.eventTypes().subscribe({
      next: (event_types) => {
        this.backendEventTypes = event_types
      },
    })

  }

  ngOnInit(): void {
    

    this.eventFormService.registerValueChangeHandlers();

    if (this.eventFormService.flyer?.value) {
      this.flyerPreview = this.eventFormService.getImageSrc(this.eventFormService.flyer.value);
    }
    this.subscription = this.eventService.loading$.subscribe({
      next: (value) => {
        this.loading = value;
      },
    })
  }

  ngOnDestroy(): void {
    this.eventFormService.destroy();
    this.subscription.unsubscribe()
  }

  protected onVenueImageSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const files = Array.from(input.files);

    const currentImages = this.eventFormService.venueImages?.value || [];

    const updatedImages = [...currentImages, ...files].slice(0, 5);

    this.eventFormService.venueImages?.setValue(updatedImages);
    this.eventFormService.venueImages?.markAsDirty();

  }

  protected onFlyerImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    this.eventFormService.flyer?.setValue(file);
    this.eventFormService.controlValueChanged(this.eventFormService.flyer);
    this.flyerPreview = URL.createObjectURL(file);
  }

  protected get eventDates(): FormArray<FormGroup> {
    return this.eventFormService.eventDates;
  }

  protected get inPersonDetails() {
    return this.eventFormService.inPersonDetails;
  }
  protected get virtualDetails() {
    return this.eventFormService.vertualDetails;
  }

  protected get meetingType() {
    return this.eventFormService.meetingType;
  }


  protected getDateControl(group: FormGroup, controlName: string): FormControl {
    return group.get(controlName) as FormControl;
  }

  protected getImageSrc(image: any): string {
    return this.eventFormService.getImageSrc(image);
  }

  protected removeImage(index: number) {
    this.eventFormService.removeVenueImage(index)
  }

  protected togglePriceModal() {
    this.showPriceModal = !this.showPriceModal;
  }
  protected toggleCapacityModal() {
    this.showCapacityModal = !this.showCapacityModal;
  }

  protected onToggle() {
    this.checked = !this.checked;
    this.eventFormService.requireApproval?.setValue(this.checked);
    this.eventFormService.controlValueChanged(this.eventFormService.requireApproval);
  }

  protected removeCapacityLimit() {
    this.eventFormService.capacity?.setValue(0);
    this.eventFormService.controlValueChanged(this.eventFormService.capacity);
    this.toggleCapacityModal();
  }

  protected setCapacityLimit() {
    this.eventFormService.controlValueChanged(this.eventFormService.capacity);
    this.toggleCapacityModal();

  }
  protected setPrice() {
    this.eventFormService.controlValueChanged(this.eventFormService.price);
    this.togglePriceModal();
  }

  protected toggleConnectZoomModal() {
    this.connectZoomModal = !this.connectZoomModal;
  }

protected createEvent() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();

 


    const invalid = this.findInvalid(this.form);
    if (invalid) {
      const message = this.getErrorMessage(invalid.control, invalid.key);
      this.notificationService.error(message);
    }

    return;
  }

  const formData = this.parseObjectToFormdata();

  this.eventService.createEvent(formData).subscribe({
    next: () => {
      this.eventFormService.resetForm();
      this.notificationService.success(`Event Successfully created`);
    },
  });
}

   private findInvalid = (
  form: FormGroup,
  parentKey: string = ''
): { key: string; control: AbstractControl } | null => {
  for (const key of Object.keys(form.controls)) {
    const control = form.get(key)!;
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (control instanceof FormGroup) {
      const child = this.findInvalid(control, fullKey);
      if (child) return child;
    } else if (control.invalid) {
      return { key: fullKey, control };
    }
  }
  return null;
};


private getErrorMessage(control: AbstractControl, fieldName: string): string {
  const errors = control.errors;

  if (!errors) return 'Invalid field';

   const label_ =  (fieldName.split(".")?.[1] || fieldName.split(".")?.[0]).toLowerCase()

  if (errors['required']) {
    return `${label_} is required`;
  }

  if (errors['minlength']) {
    const { requiredLength, actualLength } = errors['minlength'];
    return `${label_} must be at least ${requiredLength} characters (currently ${actualLength})`;
  }

  if (errors['maxlength']) {
    const { requiredLength, actualLength } = errors['maxlength'];
    return `${label_} cannot exceed ${requiredLength} characters`;
  }

  if (errors['pattern']) {
    return `${label_} format is invalid`;
  }

  if (errors['min']) {
    return `${label_} must be greater than or equal to ${errors['min'].min}`;
  }

  return `${label_} is invalid`;
}

  

  private formatDateToDDMMYYYY(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  private parseObjectToFormdata(): FormData {
    const data = this.form.getRawValue();
    const formData = new FormData();

    const eventInfo: any = {
      title: data[FIELDS.TITLE],
      description: data[FIELDS.DESCRIPTION],
      event_type_id: this.backendEventTypes.find(v => v.name === data[FIELDS.EVENT_TYPE])?.id || 0,
      event_meeting_type_id: this.backendMeetingTypes.find(v => v.name === data[FIELDS.MEETING_TYPE])?.id || 0,
      event_date: this.formatDateToDDMMYYYY(data[FIELDS.DATES]?.[0]?.[FIELDS.DATE]),
      event_time: data[FIELDS.DATES]?.[0]?.[FIELDS.TIME] || '',
      location: data[FIELDS.LOCATION] || '',
      zoomUrl: data[FIELDS.MEETING_LINK] || '',
      event_time_zone_id: data[FIELDS.DATES]?.[0]?.[FIELDS.TIME_ZONE] || '',
      event_start_time_date: this.formatDateToDDMMYYYY(data[FIELDS.DATES]?.[0]?.[FIELDS.DATE]),
      event_end_time_date: this.formatDateToDDMMYYYY(data[FIELDS.DATES]?.[1]?.[FIELDS.DATE]),
      event_start_time: data[FIELDS.DATES]?.[0]?.[FIELDS.TIME] || '',
      event_end_time: data[FIELDS.DATES]?.[1]?.[FIELDS.TIME] || '',
      event_start_time_zone_id: data[FIELDS.DATES]?.[0]?.[FIELDS.TIME_ZONE] || '',
      event_end_time_zone_id: data[FIELDS.DATES]?.[1]?.[FIELDS.TIME_ZONE] || '',
      eventOptionsRequest: {
        ticketPrice: data[FIELDS.PRICE] ?? 0,
        requiresApproval: data[FIELDS.REQUIRE_APPROVAL],
        capacity: data[FIELDS.CAPACITY] ?? 0,
      },
    };

    // --- Meeting Type: In-Person ---
    if (data[FIELDS.MEETING_TYPE] === MEETING_TYPE.IN_PERSON && data[FIELDS.IN_PERSON_DETAILS]) {
      const inPerson = data[FIELDS.IN_PERSON_DETAILS];

      Object.assign(eventInfo, {
        [FIELDS.LOCATION]: inPerson[FIELDS.LOCATION],
        [FIELDS.DESCRIPTION]: inPerson[FIELDS.DESCRIPTION],
      });

      if (Array.isArray(inPerson[FIELDS.IMAGES])) {
        (inPerson[FIELDS.IMAGES] as File[]).forEach((file: File) => {
          formData.append(`${FIELDS.IMAGES}[]`, file);
        });
      }
    }

    // --- Meeting Type: Virtual ---
    if (data[FIELDS.MEETING_TYPE] === MEETING_TYPE.VIRTUAL && data[FIELDS.VIRTUAL_DETAILS]) {
      const virtual = data[FIELDS.VIRTUAL_DETAILS];
      if (virtual[FIELDS.MEETING_LINK]) {
        Object.assign(eventInfo, {
          [FIELDS.MEETING_LINK]: virtual[FIELDS.MEETING_LINK],
          [FIELDS.DESCRIPTION]: virtual[FIELDS.DESCRIPTION],

        });
      }
    }

    if (data[FIELDS.FLYER] instanceof File) {
      formData.append('image', data[FIELDS.FLYER]);
    }

    formData.append('event', JSON.stringify(eventInfo));


    return formData;
  }

}
