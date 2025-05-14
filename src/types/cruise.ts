import { STATUS } from ".";

export interface ICruiseResponseList {
    id: string;
    title: string;
    status: STATUS;
    departure: string | null;
    duration: string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ICruiseResponseDetail {
    id?: string;
    slug: string;
    title: string;
    subTitle: string | null;
    description: string | null;
    departure: string | null;
    duration: string;
    status: STATUS;
    introductionTitle: string | null;
    introductionText: string | null;
    cta: string | null;
    destinations: IDestinationBody[];
    highlights: IHighlightBody[];
    include: IIncludeBody[];
    informations: IInformationBody[];
    cover: IImage;
    gallery: IImage[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface ICruiseBody {
    slug: string;
    title: string;
    subTitle: string | null;
    description: string | null;
    departure: string | null;
    duration: string;
    status: STATUS;
    introductionTitle: string | null;
    introductionText: string | null;
    cta: string | null;
    destinations: IDestinationBody[];
    highlights: IHighlightBody[];
    include: IIncludeBody[];
    informations: IInformationBody[];
}

export interface IDestinationBody {
    id?: string;
    title: string;
    cruise?: {
        title: string;
        id: string;
    };
    description: string | null;
    days: string | number;
    status: STATUS;
    cover?: IImage;
}

export interface IHighlightBody {
    id?: number;
    title: string;
    description: string | null;
    cover?: IImage;
}

export interface IIncludeBody {
    id?: number;
    title: string;
    description: string | null;
}

export interface IInformationBody {
    id?: number;
    title: string;
    text: string | null;
}

export interface IImage {
    id?: number;
    imageType: "COVER" | "PHOTO";
    alt: string | null;
    entityId: string;
    entityType: string;
    source: string;
}
