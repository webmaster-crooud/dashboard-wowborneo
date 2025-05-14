import { SelectDataInterface } from "~/components/ui/Form/Select.form";

export const selectStatus: SelectDataInterface[] = [
    { name: "PENDING", value: "PENDING" },
    { name: "ACTIVED", value: "ACTIVED" },
    { name: "FAVOURITED", value: "FAVOURITED" },
    { name: "BLOCKED", value: "BLOCKED" },
];

export const selectRoleByAdmin: SelectDataInterface[] = [
    { name: "Member", value: "1" },
    { name: "Admin", value: "2" },
    { name: "Agent", value: "3" },
];

export const selectRoleBySuperUser: SelectDataInterface[] = [
    { name: "Member", value: "1" },
    { name: "Admin", value: "2" },
    { name: "Agent", value: "3" },
    { name: "Owner", value: "4" },
    { name: "Developer", value: "5" },
];
