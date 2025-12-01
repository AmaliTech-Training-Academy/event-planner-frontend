import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints.constants';
import {
  TransactionManagementResponse,
  TransactionManagement,
  TransactionManagementFilterParams,
} from '../../models/transactions-management.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsBackendService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get all transactions with optional filtering and pagination
   * Backend accepts: keyword, status, page (size and sort are handled internally)
   */
  public getTransactions(
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    let params = new HttpParams();

    if (filters) {
      // Only send what backend accepts
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.keyword) {
        params = params.set('keyword', filters.keyword);
      }
      // Note: size and sort are NOT sent - backend handles these internally
    }

    return this.http.get<TransactionManagementResponse>(
      API_ENDPOINTS.PAYMENT_TRANSACTIONS,
      { params },
    );
  }

  /**
   * Get a single transaction by ID
   */
  public getTransactionById(
    transactionId: string,
  ): Observable<{ data: TransactionManagement }> {
    return this.http.get<{ data: TransactionManagement }>(
      API_ENDPOINTS.GET_TRANSACTION(transactionId),
    );
  }

  /**
   * Get transactions for a specific event
   */
  public getEventTransactions(
    eventId: string,
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.size !== undefined) {
        params = params.set('size', filters.size.toString());
      }
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
    }

    return this.http.get<TransactionManagementResponse>(
      API_ENDPOINTS.GET_EVENT_TRANSACTIONS(eventId),
      { params },
    );
  }

  /**
   * Get user's transaction history
   */
  public getUserTransactions(
    filters?: TransactionManagementFilterParams,
  ): Observable<TransactionManagementResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.size !== undefined) {
        params = params.set('size', filters.size.toString());
      }
      if (filters.sort) {
        params = params.set('sort', filters.sort);
      }
    }

    return this.http.get<TransactionManagementResponse>(
      API_ENDPOINTS.USER_TRANSACTIONS,
      { params },
    );
  }
}
