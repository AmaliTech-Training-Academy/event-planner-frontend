import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  tap,
  take,
  map,
  throwError,
  of,
} from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { EventBackendService } from './backend/event-backend.service';
import {
  DashboardData,
  EventDetails,
  EventManagement,
  mapEventDetailResponseToEventDetails,
} from '../models/events';
import { PaginatedResponse } from '../models/shared';

interface SearchCache {
  [key: string]: {
    data: PaginatedResponse<EventManagement>;
    timestamp: number;
  };
}

@Injectable({ providedIn: 'root' })
export class EventManagementService {
  private readonly _loading = new BehaviorSubject(false);
  private readonly _dashboardData = new BehaviorSubject<DashboardData | null>(
    null
  );
  private readonly _paginatedEvents =
    new BehaviorSubject<PaginatedResponse<EventManagement> | null>(null);
  private readonly _selectedEvent = new BehaviorSubject<EventDetails | null>(
    null
  );
  private readonly _searchResults =
    new BehaviorSubject<PaginatedResponse<EventManagement> | null>(null);

  // Cache configuration
  private readonly _searchCache: SearchCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public readonly selectedEvent$ = this._selectedEvent.asObservable();
  public readonly loading$ = this._loading.asObservable();
  public readonly dashboardData$ = this._dashboardData.asObservable();
  public readonly paginatedEvents$ = this._paginatedEvents.asObservable();
  public readonly searchResults$ = this._searchResults.asObservable();

  constructor(
    private readonly _backend: EventBackendService,
    private readonly _errorHandler: ErrorHandlerService
  ) {}

  public loadDashboardData(
    page = 0,
    size = 10,
    status?: string,
    search?: string
  ): Observable<DashboardData> {
    this._loading.next(true);
    // Clear search results when loading normal dashboard data
    this._searchResults.next(null);

    return this._backend.getDashboardData(page, size, status, search).pipe(
      map((res) => res.data),
      tap((data) => {
        this._dashboardData.next(data);
        this._paginatedEvents.next(data.eventManagement);
      }),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }

  // FIXED: Properly implement searchEvents method
  public searchEvents(
    keyword: string,
    page = 0,
    size = 10,
    status?: string
  ): Observable<PaginatedResponse<EventManagement>> {
    this._loading.next(true);

    // Check cache first
    const cacheKey = this._createCacheKey(keyword, page, size, status);
    const cachedData = this._getFromCache(cacheKey);

    if (cachedData) {
      console.log('📦 Using cached search results for:', cacheKey);
      this._searchResults.next(cachedData);
      this._loading.next(false);
      return of(cachedData);
    }

    console.log('🔍 Fetching search results:', {
      keyword,
      page,
      size,
      status,
    });

    return this._backend.searchEvents(keyword, page, size, status).pipe(
      map((res) => res.data),
      tap((data) => {
        console.log('📥 Search results received:', {
          totalElements: data.totalElements,
          contentLength: data.content.length,
        });
        this._searchResults.next(data);
        // Add to cache
        this._addToCache(cacheKey, data);
      }),
      catchError((err) => {
        console.error('❌ Search error:', err);
        this._errorHandler.handle(err);
        // Clear search results on error
        this._searchResults.next(null);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }

  // Method to clear search results and show normal dashboard data
  public clearSearch(): void {
    console.log('🧹 Clearing search results');
    this._searchResults.next(null);
  }

  // Clear entire cache (useful for manual refresh)
  public clearCache(): void {
    console.log('🗑️ Clearing entire cache');
    Object.keys(this._searchCache).forEach((key) => {
      delete this._searchCache[key];
    });
  }

  public loadEventDetails(eventId: number): Observable<EventDetails> {
    this._loading.next(true);
    return this._backend.getEventDetails(eventId).pipe(
      map((res) => mapEventDetailResponseToEventDetails(res.data)),
      tap((eventDetails) => this._selectedEvent.next(eventDetails)),
      catchError((err) => {
        this._errorHandler.handle(err);
        return throwError(() => err);
      }),
      finalize(() => this._loading.next(false))
    );
  }

  private _createCacheKey(
    keyword: string,
    page: number,
    size: number,
    status?: string
  ): string {
    return `${keyword.toLowerCase()}-${page}-${size}-${status || 'all'}`;
  }

  private _getFromCache(
    key: string
  ): PaginatedResponse<EventManagement> | null {
    const cached = this._searchCache[key];
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Remove expired cache entry
    if (cached) {
      delete this._searchCache[key];
    }

    return null;
  }

  private _addToCache(
    key: string,
    data: PaginatedResponse<EventManagement>
  ): void {
    this._searchCache[key] = {
      data,
      timestamp: Date.now(),
    };
  }
}
