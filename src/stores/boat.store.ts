import { atomWithStorage } from "jotai/utils";
import { IAboatRequestBody, IBoatRequestBody, ICabinRequestBody, IDeckRequestBody, IExperienceRequestBody, IFacilityRequestBody } from "~/types/boat";

export const boatBodyAtom = atomWithStorage<IBoatRequestBody>("boatBody", {
    name: "",
    description: "",
    slug: "",
    optionText: "",
    abouts: [],
    cabins: [], //
    experiences: [],
    facilities: [],
    cruiseId: "",
    status: "PENDING",
    deck: {
        title: "",
        description: "",
    },
});

export const cabinBodyAtom = atomWithStorage<ICabinRequestBody[]>("cabinBody", [
    { description: "", name: "", maxCapacity: 1, price: "", type: "TWIN" },
]);
export const aboutBodyAtom = atomWithStorage<IAboatRequestBody[]>("aboutBody", [{ description: "", title: "" }]);
export const experienceBodyAtom = atomWithStorage<IExperienceRequestBody[]>("experienceBody", [{ description: "", title: "" }]);
export const facilityBodyAtom = atomWithStorage<IFacilityRequestBody[]>("facilityBody", [{ description: "", name: "", icon: "" }]);
export const deckBodyAtom = atomWithStorage<IDeckRequestBody>("deckBody", { title: "", description: "" });
