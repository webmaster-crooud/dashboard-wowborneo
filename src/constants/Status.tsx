import { SelectDataInterface } from "~/components/ui/Form/Select.form";

export const selectStatus: SelectDataInterface[] = [
    { name: "PENDING", value: "PENDING" },
    { name: "ACTIVED", value: "ACTIVED" },
    { name: "FAVOURITED", value: "FAVOURITED" },
    { name: "BLOCKED", value: "BLOCKED" },
];

export const selectRoleByAdmin: SelectDataInterface[] = [
    { name: "Admin", value: "3" },
    { name: "Member", value: "1" },
    { name: "Agent", value: "2" },
];

export const selectRoleBySuperUser: SelectDataInterface[] = [
    { name: "Admin", value: "3" },
    { name: "Member", value: "1" },
    { name: "Agent", value: "2" },
    { name: "Owner", value: "4" },
    { name: "Developer", value: "5" },
];
