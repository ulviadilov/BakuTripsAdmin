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
}

export interface DailyProgram{
    packageOptionId:string;
    displayOrder:string;
    title:string;
    destinations:string[]
}
