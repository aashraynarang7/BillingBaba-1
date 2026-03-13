"use client"

import React, { useState } from "react"
import {
  Send,
  MapPin,
  Palette,
  FileText,
  Repeat,
  Truck,
  Landmark,
  BarChart3,
  Receipt,
  DatabaseBackup,
  Printer,
  Store,
} from "lucide-react"

const features = [
  {
    title: "Send Estimate and Quotations",
    icon: <Send className="h-6 w-6" />,
    content: {
      title: "Send Estimate and Quotations",
      paragraphs: [
        "Using our free billing software, you can easily create useful documents. It includes quotations, estimates, and accurate GST invoices. Inbuilt features in the GST billing app allow you to send quotes/estimates to customers anytime. You can send them directly through WhatsApp, email, SMS, or by printing.",
        "Billing Baba billing software provides professional outlook with instant estimates and quotes. The Billing Baba app helps automate most processes. It makes the quotes and estimates error-free. Additionally, you can set up a due date for tracking invoices seamlessly.",
        "Further, you can convert your estimates and quotations into sale invoices anytime. All you need is the Billing Baba software for billing and its done in a few clicks. Billing Baba free billing software offers the business a complete option for quickly saving more time getting instant quotes. Using the accounting software, you can manage your business with higher productivity.",
        "The billing app brings a professionalism for your valued customers to attract them back. Choosing advanced Software for GST billing is one of the best investments for your business. Our Billing Software helps simplifies estimates and quotations.",
      ],
    },
  },
  {
    title: "Track Orders",
    icon: <MapPin className="h-6 w-6" />,
    content: {
      title: "Track Orders",
      paragraphs: [
        "Using our advanced GST Compliant Software for Billing makes creating sales or purchase order formats easier. It helps set up a due date for tracking order seamlessly. With this GST Accounting and Billing Software, we get an auto stock adjustment. It help ensure the availability of inventory items.",
        "Having tracking features is pretty helpful for fulfilling the orders timely. Tracking avoid unnecessary losses. You can save time with tracking and use it to perform other day to day tasks. It enables better customer satisfaction. You can attach tax invoice with order and track if payment is due using the app.",
        "Using our GST billing app, it is easier to improve your purchase/sale order formats. As Billing Baba App provides various options, including Word, PDF, and Excel. Using our GST invoicing software, you can save labour cost and efforts. You can do save time by converting orders to sale/purchase invoices using automation.",
        "You can track open, close, and overdue orders using our free billing app. It makes it a perfect choice for businesses. Using these features makes the entire tracking process seamless for businesses. In short, it helps improve the performance of employees.",
      ],
    },
  },
  {
    title: "Choose Themes",
    icon: <Palette className="h-6 w-6" />,
    content: {
      title: "Choose Themes",
      paragraphs: [
        "Maintaining and sharing professional invoices with your clients can improve your brand’s Identity. The GST Billing App has two invoice themes for thermal printers. Also, it has twelve invoice themes for regular printers.",
        "With this GST invoice software, you can quickly improve the look of your invoice Using available customisation options is seamless. You can neatly prepare the invoice for your client. Business bills generated can better impress a client.",
        "The Billing App for GST is the best option for your accounting inventory. It is very easy to handle. Choose from the best GST invoice formats to meet your business requirements. Most businesses choose our free billing software to help present a professional image. It is an ideal way to build a positive brand image.",
        "This free billing app is efficient for quickly gaining the highest invoice standard. It provides multiple theme options for thermal and regular printers. GST Invoicing Software is suitable, and all themes are fully customisable. A business can use it for all commercial businesses. The list includes retailers, pharmaceutical businesses, gyms, restaurants, and many other businesses.",
      ],
    },
  },
  {
    title: "Record Expenses",
    icon: <FileText className="h-6 w-6" />,
    content: {
      title: "Record Expenses",
      paragraphs: [
        "Tracking and recording all expenses in the business is important for accounting and tax filing. It is easier to follow the money spent and create an accurate report with the GST billing software.",
        "Our free billing app is an efficient option for recording expenses. Businesses can easily optimise their business expenditure to save more money. With our free GST software for billing, you record both GST and non-GST expenses.",
        "Further, Billing Baba billing solutions comes with various benefits over competitors. It help you reduce costs and maximise sales. The free billing software is an efficient option for quickly recording outstanding expenses. It helps in tracking them in future too.",
        "Our free accounting software is suitable for growing businesses. It helps keep their finances in check. By recording the expenses using GST software, the company can optimise the expenditure. It helps save money. Moreover, keeping track of costs will help build better strategies. It will result in better profitability of business.",
      ],
    },
  },
  {
    title: "Receivables and Payables",
    icon: <Repeat className="h-6 w-6" />,
    content: {
      title: "Receivables and Payables",
      paragraphs: [
        "A professional,free billing and accounting software lets users keep all the transaction details and track business cash flow seamlessly. Now you have a better way of keeping your transaction details safe.",
        "Free GST Invoicing Software allows you to track party-wise receivables and payables. Using the business dashboard in the GST mobile app, you can track the money you ‘have to receive’ and the money you ‘need to pay in the Billing Baba app.",
        "You can easily track observe who didn’t pay you back. You can set payment reminders to collect dues from these customers on time. You can send free payment reminders to any party via WhatsApp, SMS, and email. You can provide all type of online payment solutions to collect dues seamlessly. Further, it will allow you to save time for your day to day tasks.",
        "Also, with the bulk payment reminder feature, you can save time by sending payment reminders to all your customers in bulk at once. The GST Billing and invoicing software perform automated calculations. It help track receivables and payables seamlessly.",
        "Using the cash flow management system by Billing Baba enables you to avoid taking too much debt and revisit your business plan as it indicates an an early sign of issues in cash flow. Further, you can also use the Billing Baba billing app to perform party-to-party balance transfers.",
      ],
    },
  },
  {
    title: "Delivery Challan",
    icon: <Truck className="h-6 w-6" />,
    content: {
      title: "Delivery Challan",
      paragraphs: [
        "Get acknowledgement upon delivery with “Delivery Challan” of Billing Baba. Create delivery challan format and attach them with your consignment using this free GST invoicing app.",
        "You can ensure your goods have reached customers safely by tracking delivery challans. Our GST billing software helps you track your consignments easily and help provide instructions if it gets misplaced. Our ultimate free GST Invoicing Software helps manage consignor and consignee details seamlessly.",
        "You can include the terms and conditions of the order to avoid disputes and bring more clarity to the scope of the order. This process makes the business run smoothly and is helpful for the customers to get the consignment safely.",
        "Converting the delivery challans into bills is also a pretty efficient option as it helps adjust auto stock. Maintain all the records of delivery acknowledgement with the GST billing & Accounting software. It is an easier way of running a business with major productivity goals.",
        "You can convert your delivery challans into invoices when the consignment reaches the customer. You can do it using the free billing app by Billing Baba. It will allow you to receive payments using multiple payment options. To avoid delayed dues collection, you can offer both offline and online payment solutions through the tax invoice.",
      ],
    },
  },
  {
    title: "Bank Accounts",
    icon: <Landmark className="h-6 w-6" />,
    content: {
      title: "Bank Accounts",
      paragraphs: [
        "Businesses can easily add, manage, and track online and offline payments quickly. If they opt for an easy-to-use free GST billing app for mobile, the tasks gets easier. Whether your revenue is from the banks or e-wallets, you can seamlessly enter data into the free billing software.",
        "You can send or receive money using bank accounts and perform bank-to-bank transfers for seamless cash flow management. So, it is ideal for businesses with all the cash-ins and cash-outs using the Billing Baba invoicing app.",
        "A business account in your bank needs to be added with the GST Accounting Software to use the bank accounts feature within the app. You can easily manage credit cards and OD and loan accounts using the Billing Baba app. This process is the most suitable option for keeping the complete bank account book without hassle. Further, it allows you to withdraw or deposit money in the bank accounts seamlessly.",
        "Free invoicing & accounting software can also be accessed anywhere with internet connectivity from your mobile. Free accounting software by Billing Baba helps you adjust the amount manually and manage cheque payments.",
        "The Billing Baba App has open cheques which allow the user to make a quick deposit or withdraw and close them quickly. Along with many other payment options available in the app, we also allow you to keep track of cheque payments.",
      ],
    },
  },
  {
    title: "Business Reports",
    icon: <BarChart3 className="h-6 w-6" />,
    content: {
      title: "Business Reports",
      paragraphs: [
        "Businesses are required to make informed decisions to ensure a consistent growth trajectory. Use 37+ business reports created using our free billing software for all your business requirements.",
        "Billing Baba accounting software comes with professional balance sheet formats. Using Billing Baba extensively increases your business’s operational efficiency as you can easily export the reports in PDF or Excel.",
        "• Accounting and management\n• Billing and e-payments\n• GST Reports and taxation",
        "Users can easily view and analyse the data instantly using our free GST Invoicing & Accounting Software. You can create graphical reports for tracking sales and expenses using the app. This free software analyses accurate business details, accounts, and many more; it is also an efficient way to quickly analyse the business’s profit. Various reports such as:",
        "• GSTR 1 format report\n• GSTR 3B format report\n• GST-related reports\n• Balance Sheet\n• Profit & Loss",
      ],
    },
  },
  {
    title: "GST Invoicing / Billing",
    icon: <Receipt className="h-6 w-6" />,
    content: {
      title: "GST Invoicing / Billing",
      paragraphs: [
        "Our all-in-one free GST billing software is an excellent addition to your business as it helps you automate your billing requirements. It is pretty efficient in assisting medium and small enterprises to save more time in accounting.",
        "With the help of free billing software with GST, business owners could efficiently perform various tasks, including GST return filing, inventory management, invoicing, and billing. Our free accounting app allows businesses to customise the fields per their unique requirements.",
        "You can use the app to generate GST invoices for your clients within 20 seconds and print/share them with customers. Bills are mainly recommended in the GST invoice format, and you can create them using ou GST Software for billing.",
        "You can use the barcode billing software and easily scan to speed up your billing process, and shortcut keys can help you do redundant tasks faster. “Bill wise payment” in the Billing Baba app is one of the essential features as it is pretty easy to link your payments with your sales invoices.",
        "The free GST mobile app creates multiple parties to manage all clients seamlessly. With the help of this feature, it is easier to track all the due dates in the invoice and track old invoices anytime. Billing Baba app allows any business to identify’ any overdue payments quickly.",
      ],
    },
  },
  {
    title: "Automatic Data Backup",
    icon: <DatabaseBackup className="h-6 w-6" />,
    content: {
      title: "Automatic Data Backup",
      paragraphs: [
        "GST billing & accounting Software is 100% secure, and you can easily store your data accurately. Our free app lets you keep your data secure by creating local, external or online Google Drive backups.",
        "You can easily use this GST Invoicing & Accounting Software to recover data quickly. The data is encrypted with added security, and the Billing Baba app is the advanced free invoicing & accounting software.",
        'Billing Baba GST billing software in India comes with a hassle-free backup system with the “auto-backup” feature. After activating this mode on the Billing Baba app, an automatic backup is created every day, so getting all your data backup is easier, so you would not lose anything.',
        "Most businesses in India have used this free accounting and invoicing software to make the job quick with added data security. The app has an encryption system that allows it to keep the data accessible to the owner only to enhance security further.",
        "Anyone in the Billing Baba team cannot use your business data, and thus it makes your data secure for future reference. Using the GST billing app, you can create data backups per your requirement and help ensure the security of your data using multiple backup options.",
      ],
    },
  },
  {
    title: "Regular / Thermal Printer",
    icon: <Printer className="h-6 w-6" />,
    content: {
      title: "Regular / Thermal Printer",
      paragraphs: [
        "Whether you require your invoice in the perfect format instead of bill format or Excel format, this free billing software is the best. Billing Baba is compatible with thermal and regular (laser) printers and can help you get your desired printout within minutes.",
        "Billing Baba’s invoicing and accounting software/app is an efficient way to print your Invoice and Bills. Now you have the better option to quickly generate the prints in all suitable size options, including regular paper size A4 & A5, thermal paper size 2” & 3”, and other custom paper size options.",
        "Connect our app with your regular/thermal printer via Bluetooth or plug-in to start printing your invoices. You can use the Billing Baba app to create and send professional invoice to your customers. You don’t need to print, and use digital methods like e-mail, SMS, or WhatsApp.",
        "Using the free GST invoicing app, you can choose from multiple Excel, Word, or PDF formats, create an invoice with complete customisation, and print it out for your customers. The process is seamless, and charges have been reduced to an all-time low in the last few years. You can use regular and thermal printers to print out the invoice and hand it over to clients.",
      ],
    },
  },
  {
    title: "Online Store",
    icon: <Store className="h-6 w-6" />,
    content: {
      title: "Online Store",
      paragraphs: [
        "Set up your online store within a few hours using the Billing Baba GST billing software. Using our mobile shop billing app, you can list all the services/products you sell to your customers online, and it will help you present a catalogue of all the services/products you sell and boost your sales online.",
        "Also, Billing Baba billing software does not levy any charge on using online store features that help you take your business online. You can send the link to your online store to your customers, and using the link, they can place orders with you online and pick up the products from your store once you have them packed.",
        "Using the online store feature in the GST billing and invoicing app for your business will help you reduce waiting time at the store counter, as you will have the package packed for your customers before they reach the store. You can bring in more customers in your locality by taking your business online using the Billing Baba online store.",
        "Using the online store is the best way to help everyone in your locality by providing doorstep or pick-up services from your store. It helps increase the sales, and hence the growth of the business. Using the GST billing software, you can update your online store anytime.",
      ],
    },
  },
]

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0)
  const activeFeature = features[activeTab]

  const renderParagraph = (paragraph: string, i: number) => {
    if (paragraph.startsWith("•")) {
      const listItems = paragraph.split("\n").map((item) => item.replace("•", "").trim())
      return (
        <ul key={i} className="space-y-2 list-disc list-inside text-muted-foreground">
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed">
        {paragraph}
      </p>
    )
  }

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Features of GST Billing and Accounting Software</h2>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to manage your business efficiently.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`w-full p-5 rounded-xl text-left transition-all duration-300 flex items-center space-x-5 border ${
                  activeTab === index
                    ? "bg-muted shadow-lg border-transparent"
                    : "bg-background shadow-sm hover:bg-muted/60 hover:shadow-md border-border"
                }`}
              >
                <div className="flex-shrink-0 rounded-full border-2 border-destructive/80 p-3 bg-background">
                  <span className="text-destructive">{feature.icon}</span>
                </div>
                <span className="font-bold text-lg text-foreground">{feature.title}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 lg:sticky top-24">
            <div key={activeTab} className="space-y-5 animate-in fade-in-50 duration-500">
              <h3 className="text-3xl font-bold text-foreground">{activeFeature.content.title}</h3>
              <div className="space-y-4">{activeFeature.content.paragraphs.map(renderParagraph)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}