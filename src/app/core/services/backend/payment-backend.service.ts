import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PAYMENT_ENDPOINTS } from '@app/core/constants/api-endpoints.constants';
import { ApiResponse } from '@app/core/models/event.model';
import { BankInformation, MoMoInformation, PaymentAnalytics, withdrawRequest } from '@app/core/models/payment.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentBackendService {
    
    constructor(private readonly _http: HttpClient) { }

    public getAnalyticsStats(): Observable<ApiResponse<PaymentAnalytics>> {
        return this._http.get<ApiResponse<PaymentAnalytics>>(PAYMENT_ENDPOINTS.PAYMENT_STATS)
    }

    public getMomoDetails(): Observable<ApiResponse<MoMoInformation>> {
        return this._http.get<ApiResponse<MoMoInformation>>(PAYMENT_ENDPOINTS.MOMO_SETTINGS)
    }

    public createMomoDetails(data: Partial<Omit<MoMoInformation, 'isActive'>>): Observable<ApiResponse<MoMoInformation>> {
        return this._http.post<ApiResponse<MoMoInformation>>(PAYMENT_ENDPOINTS.MOMO_SETTINGS, data)
    }

    public updateMomoDetails(data: Partial<Omit<MoMoInformation, 'isActive'>>): Observable<ApiResponse<MoMoInformation>> {
        return this._http.put<ApiResponse<MoMoInformation>>(PAYMENT_ENDPOINTS.MOMO_SETTINGS, data)
    }

    public getBankDetails(): Observable<ApiResponse<BankInformation>> {
        return this._http.get<ApiResponse<BankInformation>>(PAYMENT_ENDPOINTS.BANK_SETTINGS)
    }

    public createBankDetails(data: Partial<Omit<BankInformation, 'isActive'>>): Observable<ApiResponse<BankInformation>> {
        return this._http.post<ApiResponse<BankInformation>>(PAYMENT_ENDPOINTS.BANK_SETTINGS, data)
    }

    public updateBankDetails(data: Partial<Omit<BankInformation, 'isActive'>>): Observable<ApiResponse<BankInformation>> {
        return this._http.put<ApiResponse<BankInformation>>(PAYMENT_ENDPOINTS.BANK_SETTINGS, data)
    }


    public withdrawEarnings(data: withdrawRequest): Observable<ApiResponse<string>> {
        return this._http.post<ApiResponse<string>>(PAYMENT_ENDPOINTS.EARNINS_WITHDRAW, data)
    }


}
