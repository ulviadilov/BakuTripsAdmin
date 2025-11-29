export interface CustomPlaceTranslation {
  languageCode: string;
  name: string;
}

// Create payload uses lowercase per your example
export interface CreateCustomPlacePayload {
  name: string;
  placeImage: File | null;
  translations?: CustomPlaceTranslation[];
}

// Update payload uses capitalized keys per your example
export interface UpdateCustomPlacePayload {
  Name: string;
  PlaceImage: File | null;
  Translations?: CustomPlaceTranslation[];
}

export interface CustomPlaceItem {
  id: string;
  name: string;
  placeImagePath: string;
  createDate?: string;
  // depending on backend, may return translations in either key
  translations?: CustomPlaceTranslation[];
  Translations?: CustomPlaceTranslation[];
}

export interface CustomPlacesListResponse {
  places: CustomPlaceItem[];
  totalCount: number;
}

export interface CustomPlaceDetailResponse {
  place: CustomPlaceItem;
}
