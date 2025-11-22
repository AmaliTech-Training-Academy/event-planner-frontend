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
   */
  public getTransactions(
    filters?: TransactionManagementFilterParams
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
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.eventName) {
        params = params.set('eventName', filters.eventName);
      }
      if (filters.attendeeEmail) {
        params = params.set('attendeeEmail', filters.attendeeEmail);
      }
      if (filters.transactionId) {
        params = params.set('transactionId', filters.transactionId);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
    }

    return this.http.get<TransactionManagementResponse>(
      API_ENDPOINTS.PAYMENT_TRANSACTIONS,
      { params }
    );
  }

  /**
   * Get a single transaction by ID
   */
  public getTransactionById(
    transactionId: string
  ): Observable<TransactionManagement> {
    return this.http.get<TransactionManagement>(
      API_ENDPOINTS.GET_TRANSACTION(transactionId)
    );
  }

  /**
   * Get transactions for a specific event
   */
  public getEventTransactions(
    eventId: string,
    filters?: TransactionManagementFilterParams
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
      { params }
    );
  }

  /**
   * Get user's transaction history
   */
  public getUserTransactions(
    filters?: TransactionManagementFilterParams
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
      { params }
    );
  }
}
