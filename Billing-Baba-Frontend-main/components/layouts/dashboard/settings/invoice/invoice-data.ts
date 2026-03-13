export const invoiceData = {
    company: {
      name: "My Company",
      logo: "/Logo1.png",
      phone: "6393251773",
      address: "Plot No. 1, Shop No. 8, Koramangala, Bangalore, 560034",
      contact: "8888888888"
    },
    customer: {
      name: "Classic enterprises",
      address: "Plot No. 1, Shop No. 8, Koramangala, Bangalore, 560034",
      contact: "8888888888"
    },
    invoice: {
      title: "Sale",
      number: 101,
      date: "02-07-2019",
      time: "12:30 PM",
      dueDate: "17-07-2019"
    },
    items: [
      { id: 1, name: "ITEM 1", hsc: 1234, qty: 1, price: 10.00, discount: 0.10, discountPercent: 1, cgst: 0.25, sgst: 0.25, gstPercent: 2.5, total: 10.40 },
      { id: 2, name: "ITEM 2", hsc: 8325, qty: 1, price: 30.00, discount: 0.00, discountPercent: 0, cgst: 2.70, sgst: 2.70, gstPercent: 9, total: 35.40 },
    ],
    totals: {
      subTotal: 45.80,
      discount: 5.50,
      tax: 2.02,
      total: 42.32,
      received: 12.00,
      balance: 30.32,
      youSaved: 30.32,
      amountInWords: "Forty Two Rupees and Thirty Two Paisa only"
    },
    bank: {
      name: "Bank Name",
      accountNumber: "123123123123",
      ifsc: "123123123123",
      qrCode: "/Logo1.png"
    },
    terms: "Thanks for doing business with us!",
    signature: "For : My Company"
  };