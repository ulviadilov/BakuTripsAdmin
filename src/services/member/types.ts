export interface MemberTranslation {
    languageCode: string;
    firstname: string;
    lastname: string;
    description: string;
    position: string;
    team: string;
}

export interface MemberRequest{
    firstname: string;
    lastname: string;
    team: string;
    description: string;
    position: string;
    posterImage: File;
    hoverImage: File;
    translations?: MemberTranslation[];
}

export interface MemberRequestUpdate{
    firstname: string;
    lastname: string;
    team: string;
    description: string;
    position: string;
    posterImage: File | null;
    hoverImage: File | null;
    translations?: MemberTranslation[];
}
