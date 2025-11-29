export interface PartnerRequestItem {
  id: string;
  createDate: string;
  companyName: string;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  email: string;
  partnershipMessage: string;
}

export interface PartnerRequestsListResponse {
  partners: PartnerRequestItem[];
}

export interface PartnerRequestDetailResponse {
  partner: PartnerRequestItem;
}
