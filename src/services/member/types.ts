export interface MemberRequest{
    firstname:string;
    lastname:string;
    team:string;
    description:string;
    position:string;
    posterImage:File;
    hoverImage:File;
}

export interface MemberRequestUpdate{
    firstname:string;
    lastname:string;
    team:string;
    description:string;
    position:string;
    posterImage:File | null;
    hoverImage:File | null;
}
