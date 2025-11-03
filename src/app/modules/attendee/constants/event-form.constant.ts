export const EVENT_TYPE = {
  SINGLE_DAY: 'day',
  MULTI_DAY: 'multi-day',
}
export const MEETING_TYPE = {
  VIRTUAL: 'virtual',
  IN_PERSON: 'in-person',
}

export const PRICE_TYPE = {
  PAID: 'paid',
  FREE: 'free',
};

export const EVENT_FORM_FIELDS = {
  EVENT_TYPE: 'eventType',
  DATES: 'dates',
  MEETING_TYPE: 'meetingType',
  FLYER: 'flyer',
  TITLE: 'title',
  CAPACITY: 'capacity',
  PRICE: 'price',
  PERCS: 'percs',
  REQUIRE_APPROVAL: 'requireApproval',
  PRICE_TYPE: 'priceType',

  // Nested groups
  IN_PERSON_DETAILS: 'inPersonDetails',
  VIRTUAL_DETAILS: 'virtualDetails',

  // In-person details fields
  LOCATION: 'location',
  DESCRIPTION: 'description',
  IMAGES: 'images',

  // Virtual details fields
  MEETING_LINK: 'meetingLink',

  // Dates group
  LABEL: 'label',
  DATE: 'date',
  TIME: 'time',
  TIME_ZONE: 'timeZone',
} as const;
