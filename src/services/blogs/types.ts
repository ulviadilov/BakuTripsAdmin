export interface BlogTranslation {
  languageCode: string;
  mainTitle?: string;
  mainDescription?: string;
  subTitle?: string;
  subDescription?: string;
}

export interface BlogRequestPayload {
  AuthorName: string;
  MainTitle: string;
  MainDescription: string;
  SubTitle?: string;
  SubDescription?: string;
  FirstImageFile?: File | null;
  SecondImageFile?: File | null;
  FirstVideoUrl?: string;
  SecondVideoUrl?: string;
  // NOTE: backend field name is intentionally misspelled as "Translations"
  Translations?: BlogTranslation[];
}

export interface BlogResponseItem {
  id: string;
  authorName: string;
  mainTitle: string;
  mainDescription: string;
  subTitle?: string;
  subDescription?: string;
  firstImagePath?: string;
  secondImagePath?: string;
  firstVideoUrl?: string;
  secondVideoUrl?: string;
  Translations?: BlogTranslation[];
  translations?: BlogTranslation[];
  createdAt?: string;
}

export interface BlogListResponse {
  blogs: BlogResponseItem[];
  totalCount: number;
}
