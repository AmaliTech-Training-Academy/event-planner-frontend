import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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


@Component({
  selector: 'app-create-event-page',
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent, ReactiveFormsModule, CommonModule, ButtonComponent, RadioButtonComponent, SetPriceModalComponent, SetCapacityModalComponent, ConnectZoomModalComponent, UploadEventFlyerComponent, EventOptionsContainerComponent, RouterLink, NgOptimizedImage, FormErrorComponent, LocationSearchComponent],
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

  constructor(private readonly eventFormService: EventFormService, private readonly eventService: EventsServiceService, private readonly notificationService: NotificationService) {
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
  }


  ngOnDestroy(): void {
    this.eventFormService.destroy();
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

      for (const key of Object.keys(this.form.controls)) {
        const control = this.form.get(key);
        if (control && control.invalid) {
          const current_error = `Please provide a value for the ${key} field`;
          this.notificationService.error(current_error);
          break;
        }
      }


      return;
    }

    const formData = this.parseObjectToFormdataV2()




    this.eventService.createEvent(formData).subscribe({
      next: () => {
        this.eventFormService.resetForm();
        this.notificationService.success(`Event Successfully created`)
      },
    });
  }

  private parseObjectToFormdata(): FormData {
    const data = this.form.getRawValue();
    const formData = new FormData();

    const eventInfo = {
      [FIELDS.EVENT_TYPE]: this.backendEventTypes.find((v) => v.name == data[FIELDS.EVENT_TYPE])?.id || 0,
      [FIELDS.TITLE]: data[FIELDS.TITLE],
      [FIELDS.PRICE_TYPE]: data[FIELDS.PRICE_TYPE],
      [FIELDS.MEETING_TYPE]: this.backendMeetingTypes.find((v) => v.name == data[FIELDS.MEETING_TYPE])?.id || 0,
      eventOptionsRequest: {
        [FIELDS.PRICE]: data[FIELDS.PRICE] ?? 0,
        [FIELDS.REQUIRE_APPROVAL]: !!data[FIELDS.REQUIRE_APPROVAL],
        [FIELDS.CAPACITY]: data[FIELDS.CAPACITY] ?? 0,
        [FIELDS.PERCS]: data[FIELDS.PERCS] ?? '',
      },
    };

    // --- Flyer ---
    if (data[FIELDS.FLYER] instanceof File) {
      const flyerFile = data[FIELDS.FLYER] as File;
      // formData.append(FIELDS.FLYER, flyerFile);
      formData.append('flyerMeta', new Blob([JSON.stringify({
        name: flyerFile.name,
        size: flyerFile.size,
        type: flyerFile.type
      })], { type: 'application/json' }));
    }

    // --- Dates ---
    const dates = data[FIELDS.DATES] ?? [];

    if (dates.length === 1) {
      const d = dates[0];
      Object.assign(eventInfo, {
        [FIELDS.DATE]: d[FIELDS.DATE],
        [FIELDS.TIME]: d[FIELDS.TIME],
        [FIELDS.TIME_ZONE]: d[FIELDS.TIME_ZONE],
      });
    } else if (dates.length === 2) {
      for (const date of dates) {
        const label = date[FIELDS.LABEL]?.toLowerCase();
        if (!label) continue;

        Object.assign(eventInfo, {
          [`event_${label}_time_date`]: date[FIELDS.DATE],
          [`event_${label}_time`]: date[FIELDS.TIME],
          [`event_${label}_time_zone_id`]: date[FIELDS.TIME_ZONE],
        });
      }
    }

    // --- Meeting Type: In-Person ---
    if (data[FIELDS.MEETING_TYPE] === MEETING_TYPE.IN_PERSON && data[FIELDS.IN_PERSON_DETAILS]) {
      const inPerson = data[FIELDS.IN_PERSON_DETAILS];

      Object.assign(eventInfo, {
        [FIELDS.LOCATION]: inPerson[FIELDS.LOCATION],
        [FIELDS.DESCRIPTION]: inPerson[FIELDS.DESCRIPTION],
      });

      if (Array.isArray(inPerson[FIELDS.IMAGES])) {
        const imagesMeta: { name: string; size: number; type: string }[] = [];

        (inPerson[FIELDS.IMAGES] as File[]).forEach((file: File) => {
          // formData.append(`${FIELDS.IMAGES}[]`, file);
          imagesMeta.push({ name: file.name, size: file.size, type: file.type });
        });

        formData.append('inPersonImagesMeta', new Blob([JSON.stringify(imagesMeta)], { type: 'application/json' }));
      }
    }

    // --- Meeting Type: Virtual ---
    if (data[FIELDS.MEETING_TYPE] === MEETING_TYPE.VIRTUAL && data[FIELDS.VIRTUAL_DETAILS]) {
      const virtual = data[FIELDS.VIRTUAL_DETAILS];
      if (virtual[FIELDS.MEETING_LINK]) {
        Object.assign(eventInfo, {
          [FIELDS.MEETING_LINK]: virtual[FIELDS.MEETING_LINK],
        });
      }
    }

    // --- Venue Sections ---
    const sections = data[FIELDS.VENUE_SECTIONS] ?? [];
    if (Array.isArray(sections)) {
      sections.forEach((sec: any, i: number) => {
        formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_NAME}]`, sec[FIELDS.VENUE_SECTION_NAME]);
        formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_CAPACITY}]`, String(sec[FIELDS.VENUE_SECTION_CAPACITY]));
        formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_PRICE}]`, String(sec[FIELDS.VENUE_SECTION_PRICE]));
        formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_COLOR}]`, sec[FIELDS.VENUE_SECTION_COLOR]);
        formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_DESCRIPTION}]`, sec[FIELDS.VENUE_SECTION_DESCRIPTION]);

        const img = sec[FIELDS.VENUE_SECTION_IMAGE];
        if (img instanceof File) {
          formData.append(`${FIELDS.VENUE_SECTIONS}[${i}][${FIELDS.VENUE_SECTION_IMAGE}]`, img);
        }
      });
    }

    // --- Final Append ---
    // formData.append('event', JSON.stringify(eventInfo));
    formData.append('event', new Blob([JSON.stringify(eventInfo)], { type: 'application/json' }));

    return formData;
  }


  private formatDateToDDMMYYYY(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  private parseObjectToFormdataV2(): FormData {
    const data = this.form.getRawValue();
    const formData = new FormData();

    console.log(data)

    const eventInfo: any = {
      title: data[FIELDS.TITLE],
      description: data[FIELDS.DESCRIPTION] || `[10:40 AM] 2025-11-12T10:30:55.713Z ERROR 1 --- [event-service] [nio-8082-exec-4] c.e.c.e.handlers.GlobalExceptionHandler : Unexpected error occurred: Unexpected token (VALUE_STRING) within Array, expected VALUE_NUMBER_INT`,
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
        requiresApproval: !!data[FIELDS.REQUIRE_APPROVAL],
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
        const imagesMeta: { name: string; size: number; type: string }[] = [];

        (inPerson[FIELDS.IMAGES] as File[]).forEach((file: File) => {
          // formData.append(`${FIELDS.IMAGES}[]`, file);
          imagesMeta.push({ name: file.name, size: file.size, type: file.type });
        });

        formData.append('inPersonImagesMeta', new Blob([JSON.stringify(imagesMeta)], { type: 'application/json' }));
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

    if (Array.isArray(data[FIELDS.IMAGES])) {
      (data[FIELDS.IMAGES] as File[]).forEach(file => {
        formData.append('eventImages[]', file);
      });
    }

    // formData.append('event', new Blob([JSON.stringify(eventInfo)], { type: 'application/json' }));
    formData.append('event', JSON.stringify(eventInfo));


    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    console.log(eventInfo)


    return formData;
  }


}
