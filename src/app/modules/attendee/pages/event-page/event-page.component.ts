import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; 
import { VenueImageSliderComponent, VenueImage } from '../../../../shared/components/venue-image-slider/venue-image-slider.component';
import { TicketCardComponent, TicketInfo } from '../../../../shared/components/ticket-card/ticket-card.component';
import { HelpCardComponent } from '../../../../shared/components/help-card/help-card.component';


interface EventDetails {
  id: string;
  title: string;
  date: string;
  location: string;
  heroImageUrl: string;
  isPaid: boolean;
  description: string;
  attendeesCount: string; 
}

@Component({
  selector: 'app-event-page', 
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    ButtonComponent, 
    VenueImageSliderComponent,
    TicketCardComponent,
    HelpCardComponent,
    NgOptimizedImage
  ],
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss'] 
})
export class EventPageComponent implements OnInit { 

 
  public eventDetails: EventDetails | null = null; 
  public venueImages: VenueImage[] = []; 
  public ticketInfo: TicketInfo | null = null;
  public helpEmail: string = '';

  
  public ngOnInit(): void {
    this.loadEventData();
  }

  
  private loadEventData(): void {
    this.eventDetails = {
      id: 'evt123',
      title: 'Tech Innovation Summit 2025',
      date: 'April 15-17, 2025 GMT',
      location: 'Silicon Valley Convention Center',
      heroImageUrl: 'images/img.png', 
      isPaid: true,
      description: 'Join us for the most anticipated tech event of the year, bringing together industry leaders, innovators, and tech enthusiasts. The Tech Innovation Summit 2025 will showcase cutting-edge technologies, breakthrough innovations, and insights from world-renowned experts.',
      attendeesCount: '5000+' 
    };

    
    this.venueImages = [
      { url: 'images/venue1.png', alt: 'Venue Image 1' }, 
      { url: 'images/venue2.png', alt: 'Venue Image 2' },
      { url: 'images/venue3.png', alt: 'Venue Image 3' },
      { url: 'images/venue4.png', alt: 'Venue Image 4' },
      { url: 'images/venue5.png', alt: 'Venue Image 5' } 
    ];

    this.ticketInfo = {
      price: 499,
      currency: '$',
      features: [
        'Full conference access',
        'Workshop materials',
        'Networking events'
      ]
    };

    this.helpEmail = 'support@techevent.com';
  }

 
  public onRegister(): void {
    
  }
}
