export interface VenueImage {
  url: string;
  alt: string;
  description?: string;
}

export interface VenueSection {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availability: string;
  availabilityType: 'full' | 'available';
}
