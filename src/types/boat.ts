import { STATUS, TYPECABIN } from ".";
import { IImage } from "./cruise";

export interface IListBoatResponse {
    id: string;
    name: string;
    slug: string | null;
    status: STATUS;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface IBoatRequestBody {
    name: string;
    slug: string | null;
    description: string | null;
    optionText: string | null;
    status: STATUS;
    abouts: IAboatRequestBody[]; //
    experiences: IExperienceRequestBody[]; //
    facilities: IFacilityRequestBody[]; //
    cabins: ICabinRequestBody[]; //
    deck: IDeckRequestBody;
}
export interface IBoatResponse {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    optionText: string | null;
    cover?: IImage;
    status: STATUS;
    abouts: IAboutResponse[];
    experiences: IExperienceResponse[];
    facilities: IFacilityResponse[];
    cabins: ICabinResponse[];
    deck: IDeckResponse;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface IUpdateBoatRequest {
    name: string;
    description: string | null;
    optionText: string | null;
}

export interface IAboatRequestBody {
    title: string;
    description: string | null;
}
export interface IAboutResponse {
    id: string | number;
    title: string;
    description: string | null;
}

export interface IExperienceRequestBody {
    title: string;
    description: string | null;
}

export interface IExperienceResponse {
    id: string | number;
    title: string;
    description: string | null;
    cover?: IImage;
}

export interface IFacilityRequestBody {
    name: string;
    description: string | null;
    icon: string | null;
}

export interface IFacilityResponse {
    id: string | number;
    name: string;
    description: string | null;
    icon: string | null;
}

export interface ICabinRequestBody {
    name: string;
    type: TYPECABIN;
    maxCapacity: number;
    description: string | null;
    price: string | number;
}
export interface ICabinResponse {
    id: string | number;
    name: string;
    type: TYPECABIN;
    maxCapacity: number;
    description: string | null;
    price: string | number;
    cover: IImage;
}

export interface IDeckRequestBody {
    title: string;
    description: string | null;
}

export interface IDeckResponse {
    id: string | number;
    title: string;
    description: string | null;
    cover?: IImage;
}
