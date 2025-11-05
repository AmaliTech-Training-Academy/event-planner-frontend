// src/app/core/services/explore-data.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppEvent } from '../models/event-model';
import { PopularLocation, RecentSearch } from '../models/location-model';

@Injectable({
  providedIn: 'root'
})
export class ExploreDataService {

  getRecentSearches(): Observable<RecentSearch[]> {
    return of([
      { id: '1', name: 'New York, USA' },
      { id: '2', name: 'London, UK' }
    ]);
  }

  getPopularLocations(): Observable<PopularLocation[]> {
    return of([
      { name: 'San Francisco, USA', meta: 'California' },
      { name: 'Toronto, Canada', meta: 'Ontario' },
      { name: 'Sydney, Australia', meta: 'New South Wales' }
    ]);
  }

  getPaidEvents(): Observable<AppEvent[]> {
    return of([
      {
        id: 'evt1',
        imageUrl: '/assets/images/event1.jpg',
        date: '2025-04-15T00:00:00Z', 
        title: 'Tech Innovation Summit 2025',
        location: 'Silicon Valley, CA',
        attendees: 5000,
        isPaid: true
      },
      {
        id: 'evt2',
        imageUrl: '/assets/images/event2.jpg',
        date: '2025-06-20T00:00:00Z', 
        title: 'AI World Conference',
        location: 'New York, NY',
        attendees: 2500,
        isPaid: true
      }
    ]);
  }

  getFreeEvents(): Observable<AppEvent[]> {
    return of([
      {
        id: 'evt3',
        imageUrl: '/assets/images/event3.jpg',
        date: '2025-05-10T00:00:00Z', 
        title: 'Community Code & Coffee',
        location: 'Austin, TX',
        attendees: 150,
        isPaid: false
      },
      {
        id: 'evt4',
        imageUrl: '/assets/images/event4.jpg',
        date: '2025-07-15T00:00:00Z',  
        title: 'Open Source Meetup',
        location: 'Seattle, WA',
        attendees: 80,
        isPaid: false
      }
    ]);
  }
}