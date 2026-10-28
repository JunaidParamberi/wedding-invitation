/**
 * All wording, names, times and places for the invitation.
 * Edit this file to change what guests see; the layout picks it up automatically.
 */

export interface Person {
  name: string;
  nameAr: string;
  relation: 'son' | 'daughter';
  parents: string;
  home: string;
}

export interface WeddingEvent {
  label: string;
  /** Local time in India, 24h "HH:MM" */
  time: string;
  place: string;
  area: string;
  /** Google Maps link for the Directions button */
  mapUrl: string;
}

export const content = {
  bismillah: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  monogramAr: 'ج و ر',
  coupleAr: 'جنيد و رفيدة',

  groom: {
    name: 'Junaid Raziq',
    nameAr: 'جنيد رازق',
    relation: 'son',
    parents: 'Mohammed Ali & Raihanath Beegam',
    home: 'Paramberi House, Kundoor',
  } satisfies Person,

  bride: {
    name: 'Rafeeda',
    nameAr: 'رفيدة',
    relation: 'daughter',
    parents: 'Abdul Kareem & Sameera',
    home: 'Nharakat Mattan, Pookkipparambu',
  } satisfies Person,

  /** Wedding day, in India Standard Time */
  date: { year: 2026, month: 12, day: 13, weekday: 'Sunday' },
  timezoneOffset: '+05:30',

  events: [
    {
      label: 'Nikah',
      time: '10:00',
      place: 'Kundoor Gousiya',
      area: 'Kundoor, Nannambra',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=11.0150443,75.9227056&query_place_id=ChIJy_pzC0pNpjsRFJr2CFX6vEo',
    },
    {
      label: 'Reception',
      time: '12:00',
      place: 'Zain Auditorium',
      area: 'Kodakkallu',
      mapUrl:
        'https://www.google.com/maps/search/?api=1&query=11.0142552,75.9320994&query_place_id=ChIJafwmXgBNpjsRbhGrhPs9sAM',
    },
  ] satisfies WeddingEvent[],

  /** The countdown counts down to this event (index into events) */
  countdownTo: 0,
  /** Add-to-calendar block length in hours, from the first event */
  calendarHours: 5,

  quote: {
    text: 'And He placed between you affection and mercy',
    source: 'Ar-Rum · 30:21',
  },

  rsvp: {
    /** WhatsApp number, international format, digits only */
    whatsapp: '917356112111',
    maxGuests: 20,
  },

  /** Background music file in /public/audio. Leave empty for no music. */
  music: '/audio/music.mp3',
} as const;

export type Content = typeof content;
