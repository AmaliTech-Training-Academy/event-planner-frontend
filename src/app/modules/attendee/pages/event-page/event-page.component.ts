import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

import { PLACEHOLDER_IMAGE } from '@app/core/constants/user.constants';
import { EventDetail, TicketInfo, TicketType, VenueImage, VenueSection } from '@app/core/models/event.model';
import { EventsServiceService } from '../../../../core/services/events.service';
import { HelpCardComponent } from '../../../../shared/components/help-card/help-card.component';
import { RegistrationModalComponent } from '../../../../shared/components/registration-modal/registration-modal.component';
import { TicketCardComponent } from '../../../../shared/components/ticket-card/ticket-card.component';
import { VenueImageSliderComponent } from '../../../../shared/components/venue-image-slider/venue-image-slider.component';
import { VenueSectionCardComponent } from '../../../../shared/components/venue-section-card/venue-section-card.component';
import { Subscription } from 'rxjs';
import { LoadingCardComponent } from "@app/shared/components/loading-card/loading-card.component";

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TicketCardComponent,
    HelpCardComponent,
    VenueImageSliderComponent,
    VenueSectionCardComponent,
    RegistrationModalComponent,
    LoadingCardComponent
],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit , OnDestroy {

  @ViewChild('heroSection') heroSection!: ElementRef;
 protected loading = signal<boolean>(true)
  protected eventDetails = signal<EventDetail | null>(null);
  protected venueImages = signal<VenueImage[]>([]);
  protected venueSections = signal<VenueSection[]>([]);
  protected tickets = signal<TicketInfo[]>([]);
  protected helpEmail = signal<string>('support@eventhub.com');
  protected showRegistrationModal = signal(false);
  protected selectedTicket = signal<TicketType | null>(null);
  protected subscription = new Subscription()

  protected selectedHeroImage = signal<string | null>(null);
  protected selectedHeroImageAlt = signal<string | null>(null);
  protected selectedHeroImageDescription = signal<string | null>(null);

  protected readonly routes = APP_ROUTES;


  constructor(private readonly eventService: EventsServiceService, private readonly route: ActivatedRoute, private readonly router: Router) { }

  
  ngOnDestroy(): void {
      this.subscription.unsubscribe()
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate([APP_ROUTES.EXPLORE])
      return
    }

    this.subscription = this.eventService.loading$.subscribe({
      next: (loading_) => {
        this.loading.set(loading_)
      }
    })

    this.eventService.getEvent(id).subscribe({
      next: (value) => {
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

  protected handleImageFallback(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = PLACEHOLDER_IMAGE;
  }
  
}