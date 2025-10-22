import { Component, EventEmitter, Output } from '@angular/core';

interface TimeZone {
  gmt: string,
  name: string
}


@Component({
  selector: 'app-time-zone-picker',
  imports: [],
  templateUrl: './time-zone-picker.component.html',
  styleUrl: './time-zone-picker.component.scss'
})
export class TimeZonePickerComponent {

  @Output() timeZoneSelected = new EventEmitter<TimeZone>();

  protected readonly timeZones: TimeZone[] = [
    { gmt: "GMT-12:00", name: "International Date Line West" },
    { gmt: "GMT-11:00", name: "Midway Island, Samoa" },
    { gmt: "GMT-10:00", name: "Hawaii" },
    { gmt: "GMT-09:00", name: "Alaska" },
    { gmt: "GMT-08:00", name: "Pacific Time (US & Canada)" },
    { gmt: "GMT-08:00", name: "Tijuana, Baja California" },
    { gmt: "GMT-07:00", name: "Mountain Time (US & Canada)" },
    { gmt: "GMT-07:00", name: "Chihuahua, La Paz, Mazatlan" },
    { gmt: "GMT-07:00", name: "Arizona" },
    { gmt: "GMT-06:00", name: "Central Time (US & Canada)" },
    { gmt: "GMT-06:00", name: "Saskatchewan" },
    { gmt: "GMT-06:00", name: "Guadalajara, Mexico City, Monterrey" },
    { gmt: "GMT-06:00", name: "Central America" },
    { gmt: "GMT-05:00", name: "Eastern Time (US & Canada)" },
    { gmt: "GMT-05:00", name: "Indiana (East)" },
    { gmt: "GMT-05:00", name: "Bogota, Lima, Quito, Rio Branco" },
    { gmt: "GMT-04:00", name: "Atlantic Time (Canada)" },
    { gmt: "GMT-04:00", name: "Caracas, La Paz" },
    { gmt: "GMT-04:00", name: "Manaus" },
    { gmt: "GMT-04:00", name: "Santiago" },
    { gmt: "GMT-03:30", name: "Newfoundland" },
    { gmt: "GMT-03:00", name: "Brasilia" },
    { gmt: "GMT-03:00", name: "Buenos Aires, Georgetown" },
    { gmt: "GMT-03:00", name: "Greenland" },
    { gmt: "GMT-03:00", name: "Montevideo" },
    { gmt: "GMT-02:00", name: "Mid-Atlantic" },
    { gmt: "GMT-01:00", name: "Azores" },
    { gmt: "GMT-01:00", name: "Cape Verde Is." },
    { gmt: "GMT+00:00", name: "Dublin, Edinburgh, Lisbon, London" },
    { gmt: "GMT+00:00", name: "Monrovia, Reykjavik" },
    { gmt: "GMT+01:00", name: "Belgrade, Bratislava, Budapest, Ljubljana, Prague" },
    { gmt: "GMT+01:00", name: "Sarajevo, Skopje, Warsaw, Zagreb" },
    { gmt: "GMT+01:00", name: "Brussels, Copenhagen, Madrid, Paris" },
    { gmt: "GMT+01:00", name: "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna" },
    { gmt: "GMT+01:00", name: "West Central Africa" },
    { gmt: "GMT+02:00", name: "Bucharest" },
    { gmt: "GMT+02:00", name: "Cairo" },
    { gmt: "GMT+02:00", name: "Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius" },
    { gmt: "GMT+02:00", name: "Athens, Bucharest, Istanbul" },
    { gmt: "GMT+02:00", name: "Jerusalem" },
    { gmt: "GMT+02:00", name: "Harare, Pretoria" },
    { gmt: "GMT+03:00", name: "Moscow, St. Petersburg, Volgograd" },
    { gmt: "GMT+03:00", name: "Kuwait, Riyadh, Baghdad" },
    { gmt: "GMT+03:00", name: "Nairobi" },
    { gmt: "GMT+03:00", name: "Tbilisi" },
    { gmt: "GMT+03:30", name: "Tehran" },
    { gmt: "GMT+04:00", name: "Abu Dhabi, Muscat" },
    { gmt: "GMT+04:00", name: "Baku" },
    { gmt: "GMT+04:00", name: "Yerevan" },
    { gmt: "GMT+04:30", name: "Kabul" },
    { gmt: "GMT+05:00", name: "Yekaterinburg" },
    { gmt: "GMT+05:00", name: "Islamabad, Karachi, Tashkent" },
    { gmt: "GMT+05:30", name: "Chennai, Kolkata, Mumbai, New Delhi" },
    { gmt: "GMT+05:30", name: "Sri Jayawardenepura" },
    { gmt: "GMT+05:45", name: "Kathmandu" },
    { gmt: "GMT+06:00", name: "Astana, Dhaka" },
    { gmt: "GMT+06:00", name: "Novosibirsk" },
    { gmt: "GMT+06:30", name: "Yangon (Rangoon)" },
    { gmt: "GMT+07:00", name: "Bangkok, Hanoi, Jakarta" },
    { gmt: "GMT+07:00", name: "Krasnoyarsk" },
    { gmt: "GMT+08:00", name: "Beijing, Chongqing, Hong Kong, Urumqi" },
    { gmt: "GMT+08:00", name: "Kuala Lumpur, Singapore" },
    { gmt: "GMT+08:00", name: "Taipei" },
    { gmt: "GMT+08:00", name: "Perth" },
    { gmt: "GMT+08:00", name: "Irkutsk, Ulaan Bataar" },
    { gmt: "GMT+09:00", name: "Seoul" },
    { gmt: "GMT+09:00", name: "Osaka, Sapporo, Tokyo" },
    { gmt: "GMT+09:00", name: "Yakutsk" },
    { gmt: "GMT+09:30", name: "Darwin" },
    { gmt: "GMT+09:30", name: "Adelaide" },
    { gmt: "GMT+10:00", name: "Canberra, Melbourne, Sydney" },
    { gmt: "GMT+10:00", name: "Brisbane" },
    { gmt: "GMT+10:00", name: "Hobart" },
    { gmt: "GMT+10:00", name: "Vladivostok" },
    { gmt: "GMT+11:00", name: "Magadan, Solomon Is., New Caledonia" },
    { gmt: "GMT+12:00", name: "Auckland, Wellington" },
    { gmt: "GMT+12:00", name: "Fiji, Kamchatka, Marshall Is." },
    { gmt: "GMT+13:00", name: "Nuku'alofa" }
  ];


  protected selectTimeZone(timeZone: TimeZone) {
    this.timeZoneSelected.emit(timeZone);
  }

}
