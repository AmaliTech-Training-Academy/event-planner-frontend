import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, forkJoin, lastValueFrom, Observable, of, take } from 'rxjs';
import { PaymentBackendService } from './backend/payment-backend.service';
import { ErrorHandlerService } from './error-handler.service';
import { PAYMENT_TYPES } from '@app/modules/attendee/pages/payment-settings/constant/payment.contant';
import { BankInformation, MoMoInformation, PaymentAnalytics, withdrawRequest, WithoutIsActive } from '../models/payment.model';
import { ApiResponse } from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private _loadingStateSubject = new BehaviorSubject<boolean>(true);
    public readonly loading$ = this._loadingStateSubject.asObservable();

    constructor(private readonly paymentBackend: PaymentBackendService, private readonly errorHandlerService: ErrorHandlerService) { }

    public getPaymentInfo() {

        const emptyBank: ApiResponse<BankInformation> = { description: '', data: {} as BankInformation };
        const emptyMomo: ApiResponse<MoMoInformation> = { description: '', data: {} as MoMoInformation };
        const emptyAnalytics: ApiResponse<PaymentAnalytics> = { description: '', data: {amountWithdrawn:0,outstandingBalance:0,ticketsSold:0} as PaymentAnalytics };

        this.setLoading(true)
        return forkJoin({
            bank: this.paymentBackend.getBankDetails().pipe(catchError(err => of(emptyBank))),
            momo: this.paymentBackend.getMomoDetails().pipe(catchError(err => of(emptyMomo))),
            stats: this.paymentBackend.getAnalyticsStats().pipe(catchError(err => of(emptyAnalytics)))
        }).pipe(take(1), finalize(() => this.setLoading(false)))
    }


    public updatePaymentInfo(
        paymentType: PAYMENT_TYPES,
        data: WithoutIsActive<MoMoInformation> | WithoutIsActive<BankInformation>,
        action: "Create" | "Update" = "Create"
    ): Observable<ApiResponse<MoMoInformation|BankInformation| null>> {
        this.setLoading(true);

        let request: Observable<any> = of(null);

        if (paymentType === PAYMENT_TYPES.BANK) {
            if (action === "Create") {
                request = this.paymentBackend.createBankDetails(data);
            } else if (action === "Update") {
                request = this.paymentBackend.updateBankDetails(data);
            }
        }
        else if (paymentType === PAYMENT_TYPES.MoMo) {
            if (action === "Create") {
                request = this.paymentBackend.createMomoDetails(data);
            } else if (action === "Update") {
                request = this.paymentBackend.updateMomoDetails(data);
            }
        }

        return request.pipe(take(1), catchError(err => this.errorHandlerService.handle(err)),
            finalize(() => this.setLoading(false)))
    }

    public withdrawFunds(data:withdrawRequest){
        this.setLoading(true)
        return this.paymentBackend.withdrawEarnings(data).pipe(take(1), catchError(err => this.errorHandlerService.handle(err)),
            finalize(() => this.setLoading(false)))
    }

    private setLoading(isLoading: boolean): void {
        this._loadingStateSubject.next(isLoading);
    }


}
