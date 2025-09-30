export interface PrivatePackageFormData {
    tourid: string;
    price: string;
    vehicleinfo: string;
    translations?: Array<{
        languageCode: string;
        vehicleinfo: string;
    }>;
}
