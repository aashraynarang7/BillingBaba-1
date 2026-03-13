import { Youtube, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
import React from "react"

const linkGroups = {
  products: {
    title: "Our Products",
    links: ["Billing Baba App", "NeoDove (Telecalling CRM)"],
  },
  software: {
    title: "Billing Baba Software",
    links: [
      "Billing Software",
      "Accounting Software",
      "Inventory Software",
      "Invoicing Software",
      "Business Management Software",
      "Sitemap",
    ],
  },
  industry: {
    title: "Industry Solutions",
    links: ["Retail", "Grocery", "Jewellery", "Pharmacy", "Restaurant", "Clothing/Apparel"],
  },
  tools: {
    title: "Billing Baba Web Applications (Tools)",
    links: [
      "Logo Maker",
      "GST Calculator",
      "Invoice Generator",
      "Quotation Maker",
      "Proforma Invoice Generator",
      "Purchase Order Generator",
      "Receipt Maker",
      "Depreciation Calculator",
      "Straight Line Depreciation Calculator",
      "QR Code Generator",
      "Online Barcode Generator",
      "QR code scanner from image",
      "Business Card Maker",
      "Online Barcode Scanner",
    ],
  },
  formats: {
    title: "Billing Baba Formats",
    links: [
      "Invoice Formats",
      "Quotation Format",
      "Balance Sheet Formats",
      "BillBook Formats",
      "Receipt Formats",
      "Credit Note Formats",
      "Debit Note Formats",
      "Sales Report Format",
      "Estimate Format",
      "Delivery Challan Format",
      "Cash Flow Statement Format",
      "Voucher Formats",
      "Work Order Format",
      "Reconciliation Format",
      "Bill of Exchange",
      "Income statement",
    ],
  },
}

const FooterLinkColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div className="space-y-5">
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-muted hover:text-white hover:underline transition-colors text-base">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
)

export default function Footer() {
  return (
    <footer className="bg-[#2E2C2C] text-gray-300">
      <div className="container py-12">
        <div className="mb-10">
          <img src="/Logo1.png" alt="Billing Baba Logo" className="h-20 w-auto mb-3" />
          <p className="text-base text-muted">
            Billing Accounting & Inventory software for small business owners in India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
          <div className="space-y-12">
            <FooterLinkColumn {...linkGroups.products} />
            <FooterLinkColumn {...linkGroups.tools} />
          </div>
          <div className="space-y-12">
            <FooterLinkColumn {...linkGroups.software} />
            <FooterLinkColumn {...linkGroups.formats} />
          </div>
          <div className="space-y-12">
            <FooterLinkColumn {...linkGroups.industry} />
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white">Contact Info</h3>
              <div className="text-base text-muted   space-y-5">
                <div>
                  <p className="font-bold text-white">Address</p>
                  <p className="text-muted">24th 1,2 & 3rd Floor, 150/2 Enzyme Diamond 7th Cross Road, Sector 1, HSR Layout Bengaluru, Karnataka, 560102</p>
                </div>
                <div>
                  <p className="font-bold text-white">Phone</p>
                  <p className="text-muted">+91-6364-444-752</p>
                  <p className="text-muted">+91-9333-911-911</p>
                  <p className="text-muted">+91-6366-927-420</p>
                  <p className="mt-2 text-muted">09:00 AM - 09:00 PM ( All Day )</p>
                </div>
                <div>
                  <p className="font-bold text-white">Email</p>
                  <a href="mailto:help@billingbaba.in" className="hover:text-white hover:underline">
                    help@billingbaba.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-8 text-sm text-muted space-y-2 md:space-y-0 md:flex md:justify-between">
          <p className="text-muted">GST Registration Number : 29AAZCS9478EIZ7</p>
          <p className="text-muted">Udyam Registration Number : UDYAM-KR-03-0219719</p>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="container py-5 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <div className="flex flex-wrap justify-center items-center space-x-4 mb-4 sm:mb-0">
            <a href="#" className="hover:text-white text-muted">About Us</a>
            <a href="#" className="hover:text-white text-muted">Terms and Conditions</a>
            <span className="text-center text-muted">Copyright © {new Date().getFullYear()} Simply Billing Baba Apps Pvt. Ltd.™</span>
          </div>
          <div className="flex space-x-3">
            <SocialIcon href="#" icon={<Youtube className="h-4 w-4" />} />
            <SocialIcon href="#" icon={<Instagram className="h-4 w-4" />} />
            <SocialIcon href="#" icon={<Facebook className="h-4 w-4" />} />
            <SocialIcon href="#" icon={<Twitter className="h-4 w-4" />} />
            <SocialIcon href="#" icon={<Linkedin className="h-4 w-4" />} />
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="h-8 w-8 flex items-center justify-center bg-gray-700 rounded-md text-muted hover:text-destructive transition-colors"
  >
    {icon}
  </a>
)