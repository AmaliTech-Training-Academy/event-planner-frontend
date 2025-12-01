import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  tap,
  take,
  map,
} from 'rxjs';

import { TransactionsBackendService } from './backend/transactions-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import {
  PaginationInfo,
  TransactionManagement,
  TransactionManagementFilterParams,
  TransactionManagementResponse,
} from '../models/transactions-management.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsManagementService {
  private _loadingStateSubject = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loadingStateSubject.asObservable();

  private _transactionsSubject = new BehaviorSubject<TransactionManagement[]>(
    [],
  );
  public readonly transactions$ = this._transactionsSubject.asObservable();

  private _paginationInfoSubject = new BehaviorSubject<PaginationInfo | null>(
    null,
  );
  public readonly paginationInfo$ = this._paginationInfoSubject.asObservable();

  private _totalElementsSubject = new BehaviorSubject<number>(0);
  public readonly totalElements$ = this._totalElementsSubject.asObservable();

  private _totalPagesSubject = new BehaviorSubject<number>(0);
  public readonly totalPages$ = this._totalPagesSubject.asObservable();

  private _currentPageSubject = new BehaviorSubject<number>(0);
  public readonly currentPage$ = this._currentPageSubject.asObservable();

  // ✅ UPDATED: Only track what backend accepts
  private _currentFiltersSubject =
    new BehaviorSubject<TransactionManagementFilterParams>({
      page: 0,
      // Removed size and sort - backend handles these internally (10 items, sorted by transactionTime desc)
    });
  public readonly currentFilters$ = this._currentFiltersSubject.asObservable();

  constructor(
    private readonly transactionsBackend: TransactionsBackendService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}

  public loadTransactions(
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    console.log('🔧 SERVICE loadTransactions:', filters);
    this.setLoading(true);

    const appliedFilters = filters || this._currentFiltersSubject.getValue();
    this._currentFiltersSubject.next(appliedFilters);

    return this.transactionsBackend.getTransactions(appliedFilters).pipe(
      take(1),
      tap((response) => {
        console.log('✅ Transactions API response:', {
          page: response.data.number,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          contentLength: response.data.content?.length,
        });

        this._transactionsSubject.next(response.data.content);

        // Update pagination info object
        this._paginationInfoSubject.next({
          pageNumber: response.data.number,
          pageSize: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last,
        });

        // Update individual pagination subjects
        this._totalElementsSubject.next(response.data.totalElements);
        this._totalPagesSubject.next(response.data.totalPages);
        this._currentPageSubject.next(response.data.number);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }

  public loadTransactionById(
    transactionId: string,
  ): Observable<TransactionManagement> {
    this.setLoading(true);

    return this.transactionsBackend.getTransactionById(transactionId).pipe(
      take(1),
      map((response) => response.data),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }

  public loadEventTransactions(
    eventId: string,
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    this.setLoading(true);

    return this.transactionsBackend.getEventTransactions(eventId, filters).pipe(
      take(1),
      tap((response) => {
        this._transactionsSubject.next(response.data.content);
        this._paginationInfoSubject.next({
          pageNumber: response.data.number,
          pageSize: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last,
        });

        this._totalElementsSubject.next(response.data.totalElements);
        this._totalPagesSubject.next(response.data.totalPages);
        this._currentPageSubject.next(response.data.number);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }

  public loadUserTransactions(
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    this.setLoading(true);

    return this.transactionsBackend.getUserTransactions(filters).pipe(
      take(1),
      tap((response) => {
        this._transactionsSubject.next(response.data.content);
        this._paginationInfoSubject.next({
          pageNumber: response.data.number,
          pageSize: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last,
        });

        this._totalElementsSubject.next(response.data.totalElements);
        this._totalPagesSubject.next(response.data.totalPages);
        this._currentPageSubject.next(response.data.number);
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false)),
    );
  }

  public searchTransactions(searchTerm: string): void {
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      keyword: searchTerm,
      page: 0,
    }).subscribe();
  }

  public filterByStatus(status: string): void {
    console.log('🏷️ SERVICE filterByStatus:', status);
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      status,
      page: 0,
    }).subscribe();
  }

  public nextPage(): void {
    const pagination = this._paginationInfoSubject.getValue();
    if (pagination && !pagination.last) {
      const currentFilters = this._currentFiltersSubject.getValue();
      this.loadTransactions({
        ...currentFilters,
        page: pagination.pageNumber + 1,
      }).subscribe();
    }
  }

  public previousPage(): void {
    const pagination = this._paginationInfoSubject.getValue();
    if (pagination && !pagination.first) {
      const currentFilters = this._currentFiltersSubject.getValue();
      this.loadTransactions({
        ...currentFilters,
        page: pagination.pageNumber - 1,
      }).subscribe();
    }
  }

  public goToPage(page: number): void {
    console.log('📄 SERVICE goToPage:', page);
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      page,
    }).subscribe();
  }

  // ✅ REMOVED: changePageSize() method since backend doesn't support dynamic page size
  // Backend always returns 10 items per page

  public resetFilters(): void {
    this.loadTransactions({
      page: 0,
      // Removed size and sort
    }).subscribe();
  }

  public getCurrentTransactions(): TransactionManagement[] {
    return this._transactionsSubject.getValue();
  }

  public getCurrentPaginationInfo(): PaginationInfo | null {
    return this._paginationInfoSubject.getValue();
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
