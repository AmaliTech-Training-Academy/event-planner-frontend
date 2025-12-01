import { Component, OnInit, signal } from '@angular/core';
import { UploadEventFlyerComponent } from "../create-event-page/components/upload-event-flyer/upload-event-flyer.component";
import { InputComponent } from "@app/shared/ui/input/input.component";
import { FormErrorComponent } from "@app/shared/ui/form-error/form-error.component";
import { LocationSearchComponent } from "@app/shared/components/location-search/location-search.component";
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "@app/shared/ui/button/button.component";
import { EditTicketCardComponent } from "./components/edit-ticket-card/edit-ticket-card.component";
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.constants';
import { EventsServiceService } from '@app/core/services/events.service';
import { EventDetail, MeetingType, TimeZone } from '@app/core/models/event.model';
import { NotificationService } from '@app/core/services/notification.service';
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";
import { RadioButtonComponent } from "@app/shared/ui/radio-button/radio-button.component";
import { MEETING_TYPE } from '../../constants/event-form.constant';
import { EventData } from './models/edit-event.model';

@Component({
  selector: 'app-edit-event-page',
  imports: [UploadEventFlyerComponent, InputComponent, FormErrorComponent, LocationSearchComponent, CommonModule, ButtonComponent, EditTicketCardComponent, ReactiveFormsModule, LoadingCardComponent, RadioButtonComponent],
  templateUrl: './edit-event-page.component.html',
  styleUrl: './edit-event-page.component.scss'
})
export class EditEventPageComponent implements OnInit {

  protected form: FormGroup;
  protected eventId: number | null = null;
  protected flyerPreview: string = '';
  private meetingTypes: MeetingType[] = [];
  private timeZones: TimeZone[] = [];
  protected loading = signal<boolean>(true)
  protected submitting = signal<boolean>(false)
  protected MEETING_TYPES = MEETING_TYPE;

  constructor(private readonly fb: FormBuilder, private readonly route: ActivatedRoute, private readonly router: Router, private readonly eventService: EventsServiceService, private readonly notificationService: NotificationService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      flyer: [null],
      tickets: this.fb.array([]),
      meetingType: [MEETING_TYPE.IN_PERSON, Validators.required],
      eventType: [null],
      startTime: [null],
      endTime: [null],
      zoomUrl: [''],
      ticketPrice: [0],
      requiresApproval: [false],
      capacity: [0],
    });
  }


  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id')!;
    if (!eventId) {
      this.router.navigate([APP_ROUTES.MY_EVENTS])
      return
    }

    this.eventId = Number(eventId)
    this.eventService.loading$.subscribe({
      next: (value: boolean) => {
        this.loading.set(value)
      }
    })

    this.eventService.getMyEventDetail(eventId).subscribe({
      next: (response) => {
        this.form.patchValue({
          title: response.data.title,
          location: response.data.location,
          description: response.data.description,
          zoomUrl: response.data.zoomMeetingUrl,
          meetingType: this.isVirtualMeeting(response.data),
          eventType: response.data.eventType.id,
          startTime: response.data.eventTime,
          endTime: response.data.eventTime,
          requiresApproval: false,
          capacity: response.data.ticketTypes.reduce((acc, ticket) => acc + (ticket.remainingTickets + (ticket?.soldTickets || 0)), 0),
          ticketPrice: response.data.ticketTypes[0]?.price || 0,
        })
        this.flyerPreview = response.data.flyerUrl;
        const ticketsArray = this.form.get('tickets') as FormArray;
        response.data.ticketTypes.forEach(ticket => {
          ticketsArray.push(
            new FormGroup({
              id: new FormControl(ticket.id),
              type: new FormControl(ticket.type),
              description: new FormControl(ticket.description),
              price: new FormControl(ticket.price),
              isActive: new FormControl(ticket.isActive),
              remainingTickets: new FormControl(ticket.remainingTickets),
              mode: new FormControl('view')
            })
          );
        });

      }
    })

    this.eventService.meetingTypes().subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.meetingTypes = response
        }
      }
    })

    this.eventService.timeZones().subscribe({
     next: (response) => {
        if (response.length > 0) {
          this.timeZones = response
        }
      }
    })

  }


  private isVirtualMeeting(event: EventData): string {
    if (event.zoomMeetingUrl && event.zoomMeetingUrl.trim() !== '') {
      return MEETING_TYPE.VIRTUAL
    }
    return MEETING_TYPE.IN_PERSON
  }

  protected onFlyerImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.form.patchValue({
      flyer: file,
    })
    this.flyerPreview = URL.createObjectURL(file);
  }


  private addMeetingLinkControl() {
    this.form.addControl('meetingLink', this.fb.control('', Validators.required));
  }

  protected get tickets(): FormArray<FormGroup> {
    return this.form.get('tickets') as FormArray;
  }

  protected addTicket(): void {
    const ticketGroup = this.fb.group({
      id: [null],
      type: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true, Validators.required],
      price: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      remainingTickets: [1, [Validators.required, Validators.min(1)]],
      mode: ['edit', Validators.required],
    });
    this.tickets.push(ticketGroup);
  }

  protected removeTicket(index: number): void {
    this.tickets.removeAt(index);
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

    console.log(data);

    const eventInfo: any = {
      title: data.title,
      description: data.description,
      location: data.location,
      zoomUrl: data.zoomMeetingUrl,
      event_meeting_type_id: this.getEventMeetingTypeId(),
      event_type_id: data.eventType,
      event_time: this.formatDateToDDMMYYYY(new Date(data.startTime)),
      event_time_zone_id: this.returnTimeZoneId() || '',
      event_start_time_date: this.formatDateToDDMMYYYY(new Date(data.startTime)),
      event_end_time_date: this.formatDateToDDMMYYYY(new Date(data.startTime)),
      event_start_time: data.startTime.split('T')[1].substring(0, 5),
      event_date: this.formatDateToDDMMYYYY(new Date(data.startTime)),
      event_end_time: data.startTime.split('T')[1].substring(0, 5),
      event_start_time_zone_id: this.returnTimeZoneId() || '',
      event_end_time_zone_id: this.returnTimeZoneId() || '',
      eventOptionsRequest: {
        ticketPrice: data.ticketPrice,
        requiresApproval: data.requiresApproval,
        capacity: data.capacity,
      },

    };

    if (data.flyer instanceof File) {
      formData.append('image', data.flyer);
    }

    formData.append('event', JSON.stringify(eventInfo));


    return formData;
  }


  private getEventMeetingTypeId(): string {
    const meetingType = this.meetingTypes.find(
      (type) => type.name === this.form.value.meetingType
    );
    return meetingType ? meetingType.id.toString() : '';
  }


  private returnTimeCurrentTimeZone(): string {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone;
  }

  private returnTimeZoneId(){
    let timeZone_ = this.returnTimeCurrentTimeZone()
    return this.timeZones.find((timeZone)=>timeZone.zoneId == timeZone_)?.zoneId
  }

  protected sumbitUpdate() {

    if (this.form.invalid) {
      this.notificationService.error(`Please double check the fields before submitting`)
      return
    }

    const formData = this.parseObjectToFormdata()

    if (!this.eventId) {
      return
    }

    this.submitting.set(true)

    const eventId = this.eventId.toString()
    this.eventService.updateEvent(eventId, formData).subscribe({
      next: () => {

      },
      error: () => {
        this.submitting.set(false)
      },
      complete: () => {
        this.submitting.set(false)
        this.goBack()
      }
    })

  }

  protected goBack() {
    history.back()
  }

}
