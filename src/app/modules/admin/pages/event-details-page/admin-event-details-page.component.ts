import { CommonModule, Location } from '@angular/common';
import {
    Component,
    computed,
    inject,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { MOCK_EVENT_DETAILS } from '../../../../core/data/mock-data';
import {
    EventDetails,
    StatCardData,
    TicketType,
} from '../../../../core/models/event.model';
import { LayoutService } from '../../../../core/services/layout.service';

import { MANAGE_EVENT_ANALYTIC } from '@app/core/constants/manage-event.contant';
import { EventHost } from '@app/core/models/events';
import { EventAnalyticsResponse } from '@app/core/models/manage-events';
import { ManageEventService } from '@app/core/services/manage-event.service';
import { LoadingCardComponent } from '@app/shared/components/loading-card/loading-card.component';
import { take } from 'rxjs';
import { OverviewComponent } from '../../../attendee/pages/manage-event-page/components/overview/overview.component';
import { GuestComponent } from '../../../attendee/pages/manage-event-page/components/guest/guest.component';
import { RegistrationComponent } from '../../../attendee/pages/manage-event-page/components/registration/registration.component';

type TabType = 'overview' | 'guests' | 'registration';

interface ManageEventPageState {
    eventData?: EventDetails;
}

@Component({
    selector: 'app-admin-event-details-page',
    standalone: true,
    imports: [
        CommonModule,
        OverviewComponent,
        GuestComponent,
        RegistrationComponent,
        LoadingCardComponent,
    ],
    templateUrl: './admin-event-details-page.component.html',
    styleUrls: ['./admin-event-details-page.component.scss'],
})
export class AdminEventDetailsPageComponent implements OnInit, OnDestroy {
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);
    private readonly _location = inject(Location);
    private readonly _layoutService = inject(LayoutService);
    private readonly _manageService = inject(ManageEventService);

    protected readonly APP_ROUTES = APP_ROUTES;

    protected readonly eventDetails = signal<EventDetails | null>(null);
    protected readonly ticketTypes = signal<TicketType[]>([]);
    protected readonly hosts = signal<EventHost[]>([]);
    protected readonly activeTab = signal<TabType>('overview');
    protected readonly currentEventId = signal<number | null>(null);
    protected readonly eventOverview = signal<EventAnalyticsResponse | null>(
        null
    );
    protected readonly loading = signal<boolean>(true);

    protected readonly statCards = computed<readonly StatCardData[]>(() => {
        const eventoverview = this.eventOverview();
        if (!eventoverview) return MANAGE_EVENT_ANALYTIC;

        return MANAGE_EVENT_ANALYTIC.map((item) => ({
            ...item,
            value: eventoverview.data.eventStats[item.backend_key],
        }));
    });

    public ngOnInit(): void {
        this._route.params.pipe(take(1)).subscribe((params) => {
            const urlEventId = params['id'];

            if (!urlEventId) {
                this._router.navigate([APP_ROUTES.ADMIN_EVENTS]);
            } else {
                const eventId = Number(urlEventId);
                this.currentEventId.set(eventId);

                this.getOverview();

                const state = this._location.getState() as ManageEventPageState;
                if (state.eventData) {
                    this._loadEventFromState(state.eventData, eventId);
                } else {
                    this._loadEventFromState(MOCK_EVENT_DETAILS, eventId);
                }
            }
        });
    }

    private getOverview() {
        const eventId = this.currentEventId();
        if (!eventId) return;
        this.loading.set(true);
        this._manageService.getOverview(eventId).subscribe({
            next: (response) => {
                this.eventOverview.set(response);

                // Set the page title dynamically from event data
                const eventTitle = response.data.eventSummary?.title || 'Event Details';
                this._layoutService.pageTitle.set(eventTitle);
            },
            complete: () => {
                this.loading.set(false);
            },
        });
    }

    public ngOnDestroy(): void {
        // Cleanup if needed
    }

    private _loadEventFromState(eventData: EventDetails, eventId: number): void {
        const event: EventDetails = { ...eventData, id: eventId.toString() };
        this.eventDetails.set(event);
        this._layoutService.pageTitle.set(event.title);
    }

    protected setActiveTab(tab: TabType): void {
        this.activeTab.set(tab);
    }

    protected onBack(): void {
        this._router.navigate([APP_ROUTES.ADMIN_EVENTS]);
    }

    protected onViewAllGuests(): void {
        this.setActiveTab('guests');
    }

    protected onInviteGuest(): void {
        // Admin specific invite logic if needed, or remove if admins can't invite
    }
}
