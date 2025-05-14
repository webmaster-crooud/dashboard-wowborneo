import { atomWithStorage } from "jotai/utils";
import { ICruiseBody, IDestinationBody, IHighlightBody, IIncludeBody, IInformationBody } from "~/types/cruise";

export const defaultCruiseBody: ICruiseBody = {
    title: "",
    subTitle: "",
    departure: "",
    description: "",
    duration: "1",
    status: "PENDING",
    slug: "",
    cta: "",
    introductionText: "",
    introductionTitle: "",
    destinations: [],
    highlights: [],
    include: [],
    informations: [],
};

export const cruiseBodyAtom = atomWithStorage<ICruiseBody>("cruiseBody", defaultCruiseBody);

export const destinationBodyAtom = atomWithStorage<IDestinationBody[]>("destinationBody", [
    {
        title: "",
        description: "",
        days: "1",
        status: "PENDING",
    },
]);

export const highlightBodyAtom = atomWithStorage<IHighlightBody[]>("highlightBody", [
    {
        title: "",
        description: "",
    },
]);

export const informationBodyAtom = atomWithStorage<IInformationBody[]>("informationBody", [
    {
        title: "",
        text: "",
    },
]);

export const includeBodyAtom = atomWithStorage<IIncludeBody[]>("includeBody", [
    {
        title: "",
        description: "",
    },
]);
