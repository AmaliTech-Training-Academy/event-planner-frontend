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

export type TransactionManagementStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

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
  data: TransactionManagementData;
  description: string | null;
}

export interface TransactionManagementFilterParams {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  status?: string;
}