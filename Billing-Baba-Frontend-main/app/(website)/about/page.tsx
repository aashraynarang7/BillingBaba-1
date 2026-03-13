import AboutPage from "./about"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About - Billing Baba",
    description: "About Billing Baba",
}

export default function About() {
    return (
        <AboutPage />
    )
}