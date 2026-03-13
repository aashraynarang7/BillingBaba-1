import Navbar from "@/components/layouts/website/navbar"
import Footer from "@/components/layouts/website/footer"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        {/* <Navbar /> */}
        {children}
        {/* <Footer /> */}
    </>
  )
}
