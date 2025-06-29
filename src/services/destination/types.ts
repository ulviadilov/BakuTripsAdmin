export interface RequestDestination{
    tourId: string;
    displayOrder: string;
    name: string;
    duration: string;
    description: string;
    imageFile?: File | null;
}
