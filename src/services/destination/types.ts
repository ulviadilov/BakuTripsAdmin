export interface RequestDestination {
    tourId: string;
    displayOrder: string;
    name: string;
    duration: string;
    description: string;
    imageFile?: File | null;
    // Capital Translations for backend
    Translations?: DestinationTranslation[];
}

export interface DestinationTranslation {
    languageCode: string;
    name: string;
    duration: string;
    description: string;
}
