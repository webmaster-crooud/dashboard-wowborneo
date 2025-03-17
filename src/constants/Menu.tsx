import {
    Icon24Hours,
    IconFileDatabase,
    IconMail,
    IconMap2,
    IconPhoneCall,
    IconSunriseFilled,
    IconTransfer,
    IconUsersGroup,
} from "@tabler/icons-react";
import { MenuInterface } from "~/types";

export const mainMenuData: MenuInterface[] = [
    {
        title: "Order History",
        icon: <IconFileDatabase size={25} stroke={1.5} />,
        url: "/member/orders",
    },
    {
        title: "Email",
        icon: <IconMail size={25} stroke={1.5} />,
        url: "/member/email",
    },
    {
        title: "Contact",
        icon: <IconPhoneCall size={25} stroke={1.5} />,
        url: "/member/contacts",
    },
    {
        title: "Support",
        icon: <Icon24Hours size={25} stroke={1.5} />,
        url: "/member/supports",
    },
];

export const AdminMenuData: MenuInterface[] = [
    {
        title: "Cruise",
        icon: <IconSunriseFilled size={25} stroke={1.5} />,
        url: "/admin/cruises",
    },
    {
        title: "Destination",
        icon: <IconMap2 size={25} stroke={1.5} />,
        url: "/admin/destinations",
    },
    {
        title: "Member",
        icon: <IconUsersGroup size={25} stroke={1.5} />,
        url: "/admin/members",
    },
    {
        title: "Transaction",
        icon: <IconTransfer size={25} stroke={1.5} />,
        url: "/admin/transaction",
    },
];
