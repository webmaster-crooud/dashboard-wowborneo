import { Inter } from "next/font/google";
export const inter = Inter({
    display: "swap",
    subsets: ["latin"],
});

// Dapatkan waktu lokal pengguna
const now = new Date();
const hours = now.getHours();

// Tentukan greeting berdasarkan jam
export let greeting = "";
if (hours < 12) {
    greeting = "Good Morning";
} else if (hours < 18) {
    greeting = "Good Afternoon";
} else {
    greeting = "Good Evening";
}

// Format tanggal dengan Intl.DateTimeFormat (sesuai lokal, misal "id-ID" untuk Indonesia)
export const formattedDate = new Intl.DateTimeFormat("en-EN", {
    weekday: "long", // nama hari, misal "Senin"
    day: "numeric", // tanggal
    month: "long", // nama bulan, misal "Januari"
    year: "numeric", // tahun
}).format(now);
