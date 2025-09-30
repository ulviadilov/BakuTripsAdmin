export interface ContactPayload {
    displayOrder: number;
    corporateNumber: string;
    corporateMail: string;
    location: string;
    workingHours: string;
    mapUrl: string;
    // Lowercase 'translations' per requirement
    translations?: ContactTranslation[];
}

export interface ContactTranslation {
    languageCode: string;
    location: string;
    workingHours: string;
}
