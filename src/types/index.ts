export interface ResponseType {
    succeeded: boolean;
}


export interface RowType{
    [key: string]: any
    id:string
}

export interface TourFormData {
    tourCategoryId: string;
    order: string;
    name: string;
    googleMapUrl: string;
    duration: string;
    isPopular: boolean;
    shortDescription: string;
    fullDescription: string;
    priceForAdult: number;
    priceForChild: number;
    priceForInfant: number;
    importantInfos: string[];
    tourPrograms: string[];
    includes: string[];
    excludes: string[];
    posterImageFile: File | null ;
    vrimagefile: File | null ;
    tourImages: File[];
}
export interface TourFormDataGet {
    tourCategoryId: string;
    order: string;
    name: string;
    googleMapUrl: string;
    duration: string;
    isPopular: boolean;
    shortDescription: string;
    fullDescription: string;
    priceForAdult: number;
    priceForChild: number;
    priceForInfant: number;
    importantInfos: string[];
    tourPrograms: string[];
    includes: string[];
    excludes: string[];
    posterImageFile: File | null ;
    vrimagefile: File | null ;
    tourImages: {id:string;imagePath:string}[] ;
    // Translated content per language (used only for Group Tours)
    Translations?: GroupTourTranslation[];
}
export interface PackageTourOption {
  packageid: string;
  displayorder: string;
  optionname: string;
  mapurl: string;
  shortdescription: string;
  apartmentinfo: string;
  roominfo: string;
  vehicleinfo: string;
  fulldescription: string;
  price: number;
  importantinfos: string[];
  includes: string[];
  excludes: string[];
  vrimagefile: File | null;
  tourimagefiles: File[];
    // Translations for package option (capital T for backend)
    Translations?: PackageOptionTranslation[];
}
export interface PackageTourOptionGet {
  packageid: string;
  displayorder: string;
  optionname: string;
  mapurl: string;
  shortdescription: string;
  apartmentinfo: string;
  roominfo: string;
  vehicleinfo: string;
  fulldescription: string;
  price: number;
  importantinfos: string[];
  includes: string[];
  excludes: string[];
  vrimagefile: File | null;
  travelPackageImages: File[];
    // Include translations when editing
    Translations?: PackageOptionTranslation[];
}

export interface PrivateFormData {
    tourcategoryid: string;
    order: string;
    name: string;
    googlemapurl: string;
    duration: string;
    ispopular: boolean;
    isPopular?:boolean
    shortdescription: string;
    fulldescription: string;
    importantinfos: string[];
    tourprograms: string[];
    includes: string[];
    excludes: string[];
    posterimagefile: File | null;
    vrimagefile: File | null;
    tourimagefiles: File[];
    // Private tour translations (capitalized Translations for backend)
    Translations?: GroupTourTranslation[];
}
export interface PrivateFormDataGet {
    tourcategoryid: string;
    order: string;
    name: string;
    googlemapurl: string;
    duration: string;
    ispopular: boolean;
    isPopular?:boolean
    shortdescription: string;
    fulldescription: string;
    importantinfos: string[];
    tourprograms: string[];
    includes: string[];
    excludes: string[];
    posterimagefile: File | null;
    vrimagefile: File | null;
    tourImages: File[];
    // Include all translations when fetching for edit
    Translations?: GroupTourTranslation[];
}

export interface DailyProgram{
    packageOptionId:string;
    displayOrder:string;
    title:string;
    destinations:string[]
    // Optional translations (lowercase key per backend contract)
    translations?: DailyProgramTranslation[];
}

// Daily Program translations structure
export interface DailyProgramTranslation {
    languageCode: string;
    title: string;
    destinations: string[];
}

// Group Tour translations structure
export interface GroupTourTranslation {
    languageCode: string; // e.g., 'az', 'ru'
    name: string;
    duration: string;
    shortDescription: string;
    fullDescription: string;
    includes: string[];
    excludes: string[];
    importantInfos: string[];
    tourPrograms: string[];
}

// Package Tour Option translations structure
export interface PackageOptionTranslation {
    languageCode: string;
    optionName: string;
    shortDescription: string;
    apartmentInfo: string;
    importantInfos: string[];
    roomInfo: string;
    includes: string[];
    fullDescription: string;
    excludes: string[];
    vehicleInfo: string;
}
