import CareerPage from "./career"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Career - Billing Baba",
    description: "Career Billing Baba",
}

export default function Career() {
    return (
        <CareerPage />
    )
}