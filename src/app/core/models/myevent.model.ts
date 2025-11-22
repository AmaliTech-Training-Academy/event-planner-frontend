export interface MyEventResponse {
    description: string;
    data: PaginatedResponseData<MyEventItem[]>;
}

export interface PaginatedResponseData<T> {
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    content: T;
    number: number;
    sort: Sort;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface MyEventData {
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    content: MyEventItem[];
    number: number;
    sort: Sort;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface Pageable {
    unpaged: boolean;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    offset: number;
    sort: Sort;
}

export interface Sort {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
}

export interface MyEventItem {
    id: number;
    title: string;
    startTime: string;
    location: string;
    flyerUrl: string;
    attendeesCount: number;
    attendees?: number;
    isPaid: boolean;
    ticketPrice?: number;
}

export interface MyEventStatsResponse {
    description: string;
    data: DashboardStats;
}

export interface DashboardStats {
    totalEvents: number;
    totalAttendees: number;
    totalTicketSales: number;
}