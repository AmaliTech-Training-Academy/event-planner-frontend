import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { RadioButtonComponent } from "../../../../shared/ui/radio-button/radio-button.component";
import { EventDatePickerComponent } from "../../components/event-date-picker/event-date-picker.component";
import { EventTimePickerComponent } from "../../components/event-time-picker/event-time-picker.component";
import { EventTimeZonePickerComponent } from "../../components/event-time-zone-picker/event-time-zone-picker.component";
import { EventFormService } from '../../services/event-form.service';
import { ConnectZoomModalComponent } from "./components/connect-zoom-modal/connect-zoom-modal.component";
import { SetCapacityModalComponent } from "./components/set-capacity-modal/set-capacity-modal.component";
import { SetPriceModalComponent } from "./components/set-price-modal/set-price-modal.component";
import { UploadEventFlyerComponent } from "./components/upload-event-flyer/upload-event-flyer.component";
import { EVENT_TYPE, EVENT_FORM_FIELDS as FIELDS, MEETING_TYPE } from './../../constants/event-form.constant';
import { EventOptionsContainerComponent } from "./components/event-options-container/event-options-container.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-event-page',
  imports: [CommonModule, EventDatePickerComponent, EventTimePickerComponent, EventTimeZonePickerComponent, ReactiveFormsModule, CommonModule, InputComponent, ButtonComponent, RadioButtonComponent, SetPriceModalComponent, SetCapacityModalComponent, ConnectZoomModalComponent, UploadEventFlyerComponent, EventOptionsContainerComponent, RouterLink , NgOptimizedImage],
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

  constructor(private readonly eventFormService: EventFormService) {
    this.form = this.eventFormService.getForm();
    this.checked = this.eventFormService.requireApproval?.value;
  }


  ngOnInit(): void {
    this.eventFormService.registerValueChangeHandlers();
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
      return;
    }

    // TODO: Implement event creation logic here
    this.eventFormService.resetForm();
  }

}
