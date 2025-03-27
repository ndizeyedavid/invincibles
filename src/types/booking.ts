export interface CreateBooking {
  booking_id: string;
  property_id: string;
  renter_id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  guestCount: number;
}

export interface UpdateBooking {
  booking_id: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  guestCount: number;
}
