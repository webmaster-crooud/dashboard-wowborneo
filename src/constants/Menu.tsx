import {
    Icon24Hours,
    IconCalendarEvent,
    IconDiscount2,
    IconFileDatabase,
    IconMail,
    IconPhoneCall,
    IconReceiptRefund,
    IconShip,
    IconSunrise,
    IconTransfer,
    IconUserScan,
    IconUsersGroup,
} from "@tabler/icons-react";
import { MenuInterface } from "~/types";

export const mainMenuData: MenuInterface[] = [
    {
        title: "Booking",
        icon: <IconFileDatabase size={25} stroke={1.5} />,
        url: "/member/bookings",
    },
    {
        title: "Refund",
        icon: <IconReceiptRefund size={25} stroke={1.5} />,
        url: "/member/bookings/refunds",
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

export const agentMenuData: MenuInterface[] = [
    {
        title: "Booking",
        icon: <IconFileDatabase size={25} stroke={1.5} />,
        url: "/member/bookings",
    },
    {
        title: "Refund",
        icon: <IconReceiptRefund size={25} stroke={1.5} />,
        url: "/member/bookings/refunds",
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
    {
        title: "Schedule",
        icon: <IconCalendarEvent size={25} stroke={1.5} />,
        url: "/member/schedules",
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
        title: "Agent",
        icon: <IconUserScan size={25} stroke={1.5} />,
        url: "/admin/agents",
    },
    {
        title: "Booking",
        icon: <IconTransfer size={25} stroke={1.5} />,
        url: "/admin/bookings",
    },
    {
        title: "Refund",
        icon: <IconReceiptRefund size={25} stroke={1.5} />,
        url: "/admin/refunds",
    },
    {
        title: "Promotions",
        icon: <IconDiscount2 size={25} stroke={1.5} />,
        url: "/admin/promotions",
    },
];
