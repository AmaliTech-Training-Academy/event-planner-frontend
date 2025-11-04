export const APP_ROUTES = {
    LOGIN : "/auth/login",
    SIGNUP: "/auth/signup",
    FORGOT_PASSWORD: "/auth/forgot-password",
    LANDING_PAGE : "/",
    EXPLORE:"/app/explore",
    EVENT_DETAILS:(id:string)=>`/app/event/${id}`,
    VERIFY_EMAIL:'/auth/verify-email',
    ADMIN_LOGIN:'/auth/admin',
    VENUE_SECTION:'/app/define-venue-sections',
    MANAGE_EVENT_ROLES:'/app/manage-event-roles',
    RESET_PASSWORD:'/auth/reset-password',
    CREATE_EVENT:'/app/create-event',
}