import {
    Icon24Hours,
    IconCalendarEvent,
    IconFileDatabase,
    IconMail,
    IconPhoneCall,
    IconShip,
    IconSunrise,
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

export const adminMenuData: MenuInterface[] = [
    {
        title: "Cruise",
        icon: <IconSunrise size={25} stroke={1.5} />,
        url: "/admin/cruises",
    },
    {
        title: "Boat",
        icon: <IconShip size={25} stroke={1.5} />,
        url: "/admin/boats",
    },
    {
        title: "Schedule",
        icon: <IconCalendarEvent size={25} stroke={1.5} />,
        url: "/admin/schedules",
    },
    {
        title: "Member",
        icon: <IconUsersGroup size={25} stroke={1.5} />,
        url: "/admin/member",
    },
    {
        title: "Transaction",
        icon: <IconTransfer size={25} stroke={1.5} />,
        url: "/admin/transaction",
    },
];
