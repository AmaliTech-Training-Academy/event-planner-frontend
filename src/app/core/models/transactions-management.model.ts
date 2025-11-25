export interface TransactionManagement {
  transactionId: string;
  eventName: string;
  eventOrganizer: string;
  attendeeEmail: string;
  amount: number | null;
  paymentMethod: string | null;
  status: TransactionManagementStatus;
  transactionTime: string;
}

export type TransactionManagementStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface PageableInfo {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface TransactionManagementData {
  content: TransactionManagement[];
  pageable: PageableInfo;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface TransactionManagementResponse {
  description: string | null;
  data: TransactionManagementData;
}

export interface TransactionManagementFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  eventName?: string;
  attendeeEmail?: string;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}