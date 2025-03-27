export interface CreateProperty {
  property_id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  host_id: string;
  maxGuests: number;
  bathrooms: number;
  bedrooms: number;
  latitude: number;
  longitude: number;
}

export interface UpdateProperty {
  property_id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  host_id: string;
  maxGuests: number;
  bathrooms: number;
  bedrooms: number;
  latitude: number;
  longitude: number;
}
