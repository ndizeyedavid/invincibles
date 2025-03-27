export interface CreateImage {
  image_id: string;
  property_id: string;
  url: string;
  isPrimary: boolean;
}

export interface UpdateImage {
  image_id: string;
  url: string;
  isPrimary?: boolean;
}
