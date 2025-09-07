export interface SliderType {
    displayOrder: string;
    title: string;
    subTitle: string;
    backgroundImage: File;
    translations:{languageCode:string,title:string,subTitle:string}[]
}

export type SliderUpdateType = Omit<SliderType, "backgroundImage"> & {
    backgroundImagePath: File | null;
};
