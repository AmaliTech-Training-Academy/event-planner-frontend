import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import {
  EventDetail,
  TicketInfo,
  TicketType,
  VenueImage,
  VenueSection
} from '../../../../core/models/event.model';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { HelpCardComponent } from '../../../../shared/components/help-card/help-card.component';
import { RegistrationModalComponent } from '../../../../shared/components/registration-modal/registration-modal.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { VenueImageSliderComponent } from '../../../../shared/components/venue-image-slider/venue-image-slider.component';
import { VenueSectionCardComponent } from '../../../../shared/components/venue-section-card/venue-section-card.component';
import { EventsServiceService } from '../../../../core/services/events.service';


@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    DatePickerComponent,
    TicketCardComponent,
    HelpCardComponent,
    VenueImageSliderComponent,
    VenueSectionCardComponent,
    RegistrationModalComponent,
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit {
  
  @ViewChild('heroSection') heroSection!: ElementRef;

   eventDetails = signal<EventDetail | null>(null);
   venueImages = signal<VenueImage[]>([]);
   venueSections = signal<VenueSection[]>([]);
   tickets = signal<TicketInfo[]>([]);
   helpEmail = signal<string>('');
   showDatePicker = signal(false);
   showRegistrationModal = signal(false);
   selectedTicket = signal<TicketType | null>(null);

  
   selectedHeroImage = signal<string | null>(null);
   selectedHeroImageAlt = signal<string | null>(null);
   selectedHeroImageDescription = signal<string | null>(null);

  protected readonly routes = APP_ROUTES;


  constructor (private readonly eventService:EventsServiceService, private readonly route:ActivatedRoute, private readonly router:Router){}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) {
      this.router.navigate([APP_ROUTES.EXPLORE])
      return
    }

    this.eventService.getEvent(id).subscribe({
      next : (value)=>{
        this.eventDetails.set(value);
      }
    })
  }

  protected onRegister(ticket: TicketType): void {
    this.selectedTicket.set(ticket);
    this.showRegistrationModal.set(true);
  }

  protected onCancelRegistration(): void {
    this.showRegistrationModal.set(false);
    this.selectedTicket.set(null);
  }

  protected onSubmitRegistration(formData: any): void {
    this.showRegistrationModal.set(false);
    this.selectedTicket.set(null);
  }

  protected toggleDatePicker(): void {
    this.showDatePicker.update((v) => !v);
  }

  protected onDateSelected(date: Date): void {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    this.eventDetails.update((details) => {
      if (details) {
        return { ...details, date: formattedDate };
      }
      return null;
    });

    this.showDatePicker.set(false);
  }

  
  protected onVenueImageClick(imageData: VenueImage): void {
    
    this.selectedHeroImage.set(imageData.url);
    this.selectedHeroImageAlt.set(imageData.alt || 'Venue image');
    this.selectedHeroImageDescription.set(imageData.description || null);

   
    this.scrollToHero();
  }


  protected resetHeroImage(): void {
    this.selectedHeroImage.set(null);
    this.selectedHeroImageAlt.set(null);
    this.selectedHeroImageDescription.set(null);
  }

  
  private scrollToHero(): void {
    setTimeout(() => {
      this.heroSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
}