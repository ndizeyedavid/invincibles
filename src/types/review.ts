export interface CreateReview {
  review_id: string;
  property_Id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment: string;
}

export interface UpdateReview {
  review_id: string;
  property_Id: string;
  user_id: string;
  booking_id: string;
  rating: number;
  comment: string;
}
