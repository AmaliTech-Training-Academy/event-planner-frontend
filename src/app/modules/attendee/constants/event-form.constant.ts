export const EVENT_TYPE = {
  SINGLE_DAY: 'DAY_EVENT',
  MULTI_DAY: 'MULTI_DAY_EVENT',
}

export const MEETING_TYPE = {
  VIRTUAL: 'VIRTUAL',
  IN_PERSON: 'IN_PERSON',
}

export const PRICE_TYPE = {
  PAID: 'paid',
  FREE: 'free',
};

export const EVENT_FORM_FIELDS = {
  EVENT_TYPE: 'event_type_id',
  DATES: 'dates',
  MEETING_TYPE: 'event_meeting_type_id',
  FLYER: 'image',
  TITLE: 'title',
  CAPACITY: 'capacity',
  PRICE: 'ticketPrice',
  PERCS: 'percs',
  REQUIRE_APPROVAL: 'requiresApproval',
  PRICE_TYPE: 'priceType',
  VENUE_SECTIONS: 'venuSections',

  // VENUE GROUP
  VENUE_SECTION_NAME: "name",
  VENUE_SECTION_CAPACITY: "capacity",
  VENUE_SECTION_PRICE: "ticketPrice",
  VENUE_SECTION_COLOR: "color",
  VENUE_SECTION_DESCRIPTION: "description",
  VENUE_SECTION_IMAGE: "image",

  // Nested groups
  IN_PERSON_DETAILS: 'inPersonDetails',
  VIRTUAL_DETAILS: 'virtualDetails',

  // In-person details fields
  LOCATION: 'location',
  DESCRIPTION: 'description',
  IMAGES: 'eventImages',

  // Virtual details fields
  MEETING_LINK: 'zoomUrl',

  // Dates group
  LABEL: 'label',
  DATE: 'event_date',
  TIME: 'event_time',
  TIME_ZONE: 'event_time_zone_id',

} as const;
