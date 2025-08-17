export interface PromoCodeCreateRequest {
    code: string;
    discountPercent: number;
    isActive: boolean;
    maxUsageCount: number;
    minOrderAmount: number;
    maxDiscountAmount: number;
}

export interface PromoCodeRespone {
    promoCodes: {
        id: string;
        code: string;
        discountPercent: number;
        isActive: boolean;
        maxUsageCount: number;
        minOrderAmount: number;
        maxDiscountAmount: number;
    }[];
    totalCount: number;
}
