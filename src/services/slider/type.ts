export interface SliderType {
    displayOrder: string;
    title: string;
    subTitle: string;
    backgroundImage: File;
}

export type SliderUpdateType = Omit<SliderType, "backgroundImage"> & {
    backgroundImagePath: File | null;
};
