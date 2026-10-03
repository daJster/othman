export type Attendee = {
  name: string;
  avatar: string;
};

export type MeetingStatus = 'soon' | 'upcoming' | 'scheduled';

export type Meeting = {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: string;
  meetLink: string;
  status: MeetingStatus;
  attendees: Attendee[];
  organizer: string;
  location: string;
};
