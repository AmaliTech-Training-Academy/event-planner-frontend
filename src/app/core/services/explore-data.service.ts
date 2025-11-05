import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppEvent } from '../models/event-model';
import { PopularLocation, RecentSearch } from '../../core/models/location-model';

@Injectable({
  providedIn: 'root'
})
export class ExploreDataService {

  constructor() { }

  
  getRecentSearches(): Observable<RecentSearch[]> {
    return of([
      { name: 'New York, USA', id: 'ny' },
      { name: 'London, UK', id: 'ldn' }
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
      { id: 'p1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: true },
      { id: 'p2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: true },
      { id: 'p3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: true },
      { id: 'p4', imageUrl: 'images/event3.jpg', date: 'Apr 29, 2025', title: 'Future of AI Panel', location: 'San Francisco, CA', attendees: 150, isPaid: true },
      { id: 'p5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Angular Connect Live', location: 'San Francisco, CA', attendees: 450, isPaid: true },
      { id: 'p6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Startup Pitch Night', location: 'San Francisco, CA', attendees: 300, isPaid: true }
    ]);
  }

  getFreeEvents(): Observable<AppEvent[]> {
    return of([
      { id: 'f1', imageUrl: 'images/event1.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: false },
      { id: 'f2', imageUrl: 'images/event2.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: false },
      { id: 'f3', imageUrl: 'images/event3.jpg', date: 'Apr 28, 2025', title: 'Tech Innovation Summit 2025', location: 'San Francisco, CA', attendees: 250, isPaid: false },
      { id: 'f4', imageUrl: 'images/event1.jpg', date: 'Apr 29, 2025', title: 'Open Source Meetup', location: 'San Francisco, CA', attendees: 80, isPaid: false },
      { id: 'f5', imageUrl: 'images/event2.jpg', date: 'Apr 30, 2025', title: 'Community Code Jam', location: 'San Francisco, CA', attendees: 120, isPaid: false },
      { id: 'f6', imageUrl: 'images/event3.jpg', date: 'May 01, 2025', title: 'Intro to Web3', location: 'San Francisco, CA', attendees: 95, isPaid: false }
    ]);
  }
}