import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  tap,
  take,
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
    []
  );
  public readonly transactions$ = this._transactionsSubject.asObservable();

  private _paginationInfoSubject = new BehaviorSubject<PaginationInfo | null>(
    null
  );
  public readonly paginationInfo$ = this._paginationInfoSubject.asObservable();

  private _currentFiltersSubject =
    new BehaviorSubject<TransactionManagementFilterParams>({
      page: 0,
      size: 10,
      sort: 'transactionTime,desc',
    });
  public readonly currentFilters$ = this._currentFiltersSubject.asObservable();

  constructor(
    private readonly transactionsBackend: TransactionsBackendService,
    private readonly errorHandlerService: ErrorHandlerService
  ) {}

  /**
   * Load transactions with optional filters
   */
  public loadTransactions(
    filters?: TransactionManagementFilterParams
  ): Observable<TransactionManagementResponse> {
    this.setLoading(true);

    const appliedFilters = filters || this._currentFiltersSubject.getValue();
    this._currentFiltersSubject.next(appliedFilters);

    return this.transactionsBackend.getTransactions(appliedFilters).pipe(
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
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Load transaction by ID
   */
  public loadTransactionById(
    transactionId: string
  ): Observable<TransactionManagement> {
    this.setLoading(true);

    return this.transactionsBackend.getTransactionById(transactionId).pipe(
      take(1),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Load transactions for a specific event
   */
  public loadEventTransactions(
    eventId: string,
    filters?: TransactionManagementFilterParams
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
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Load user's transaction history
   */
  public loadUserTransactions(
    filters?: TransactionManagementFilterParams
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
      }),
      catchError((err) => this.errorHandlerService.handle(err)),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Search transactions
   */
  public searchTransactions(searchTerm: string): void {
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      transactionId: searchTerm,
      page: 0, // Reset to first page on search
    }).subscribe();
  }

  /**
   * Filter by status
   */
  public filterByStatus(status: string): void {
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      status,
      page: 0,
    }).subscribe();
  }

  /**
   * Go to next page
   */
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

  /**
   * Go to previous page
   */
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

  /**
   * Go to specific page
   */
  public goToPage(page: number): void {
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      page,
    }).subscribe();
  }

  /**
   * Change page size
   */
  public changePageSize(size: number): void {
    const currentFilters = this._currentFiltersSubject.getValue();
    this.loadTransactions({
      ...currentFilters,
      size,
      page: 0, // Reset to first page
    }).subscribe();
  }

  /**
   * Reset filters
   */
  public resetFilters(): void {
    this.loadTransactions({
      page: 0,
      size: 10,
      sort: 'transactionTime,desc',
    }).subscribe();
  }

  /**
   * Get current transactions value (synchronous)
   */
  public getCurrentTransactions(): TransactionManagement[] {
    return this._transactionsSubject.getValue();
  }

  /**
   * Get current pagination info (synchronous)
   */
  public getCurrentPaginationInfo(): PaginationInfo | null {
    return this._paginationInfoSubject.getValue();
  }

  private setLoading(isLoading: boolean): void {
    this._loadingStateSubject.next(isLoading);
  }
}
