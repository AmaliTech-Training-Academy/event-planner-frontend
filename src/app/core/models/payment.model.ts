export interface OrderDetails {
  event: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
}

export interface MoMoInformation {
  networkOperator: string,
  mobileMoneyNumber: string,
  accountHolderName: string,
  isActive: boolean
}


export interface BankInformation {
  bankName: string,
  accountNumber: string,
  accountHolderName: string,
  isActive: boolean
}


export interface PaymentAnalytics {
  ticketsSold: number,
  amountWithdrawn: number,
  outstandingBalance: number

}

export type WithoutIsActive<T> = Partial<Omit<T, "isActive">>;


export interface withdrawRequest {
  amount: number;
  withdrawalMethod: string,
  provider: string,
  accountNumber: string,
  accountName: string
}
