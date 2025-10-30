import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For @if, etc.
import { RouterModule } from '@angular/router'; // For routerLink

// Import your reusable components
// Assuming Header/Footer are handled globally
// import { HeaderComponent } from '../../../../shared/components/header/header.component';
// import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component'; // Ensure path is correct
import { VenueImageSliderComponent, VenueImage } from '../../../../shared/components/venue-image-slider/venue-image-slider.component'; // Import VenueImage interface
import { TicketCardComponent, TicketInfo } from '../../../../shared/components/ticket-card/ticket-card.component';
import { HelpCardComponent } from '../../../../shared/components/help-card/help-card.component';

// Define a more detailed interface for this page
interface EventDetails {
  id: string;
  title: string;
  date: string;
  location: string;
  heroImageUrl: string;
  isPaid: boolean;
  description: string;
  attendeesCount: string; // Changed to string for "5000+"
}

@Component({
  selector: 'app-event-page', // Assuming this is the correct selector
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Import RouterModule
    // HeaderComponent, // Should be global
    // FooterComponent, // Should be global
    ButtonComponent, // Ensure ButtonComponent is correctly imported
    VenueImageSliderComponent,
    TicketCardComponent,
    HelpCardComponent
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnInit {

  // --- Properties for the template (public) ---
  public eventDetails: EventDetails | null = null; // Use the specific interface
  public venueImages: VenueImage[] = []; // Use the correct VenueImage type
  public ticketInfo: TicketInfo | null = null;
  public helpEmail: string = '';

  // Angular Lifecycle Hook (public)
  public ngOnInit(): void {
    // Simulate fetching data
    this.loadEventData();
  }

  // --- Method to load placeholder data (private) ---
  private loadEventData(): void {
    // Replace this with actual data fetching later
    this.eventDetails = {
      id: 'evt123',
      title: 'Tech Innovation Summit 2025',
      date: 'April 15-17, 2025 GMT',
      location: 'Silicon Valley Convention Center',
      heroImageUrl: 'images/img.png', // Use correct path without assets/
      isPaid: true,
      description: 'Join us for the most anticipated tech event of the year, bringing together industry leaders, innovators, and tech enthusiasts. The Tech Innovation Summit 2025 will showcase cutting-edge technologies, breakthrough innovations, and insights from world-renowned experts.',
      attendeesCount: '5000+' // Use string for "5000+"
    };

    // Update to use VenueImage objects with 'url' and 'alt'
    this.venueImages = [
      { url: 'images/venue1.png', alt: 'Venue Image 1' }, // Use correct paths without assets/
      { url: 'images/venue2.png', alt: 'Venue Image 2' },
      { url: 'images/venue3.png', alt: 'Venue Image 3' },
      { url: 'images/venue4.png', alt: 'Venue Image 4' },
      { url: 'images/venue5.png', alt: 'Venue Image 5' } // Add more if needed
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

  // --- Method called by the template (public) ---
  public onRegister(): void {
    console.log('Register button clicked for event:', this.eventDetails?.id);
    // TODO: Implement registration logic (e.g., navigate to registration form)
  }
}

