export interface Reservation {
  _id: string;
  email: string;
  date: string;
  cancha_id: string;
  state: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  __v: number;
}
