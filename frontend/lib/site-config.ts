export const BRAND = {
    name: "Auraava",
    phone: "+91 9718370125",
    whatsappNumber: "919598028672",
    emails: ["customer@auraava.com", "auraavacare@gmail.com"],
    hours: "Mon - Sat | 10:00 AM - 7:00 PM (IST)",
    socials: {
        facebook: "https://www.facebook.com/auraavacare",
        instagram: "https://www.instagram.com/auraavacare?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        youtube: "https://www.youtube.com/@auraavacare",
        x: "https://twitter.com/auraavacare",
        linkedin: "https://www.linkedin.com/company/auraavacare",
    },
    policyPdf: "/bgimage/Policy.pdf",
}

export function waLink(message: string, phone: string = BRAND.whatsappNumber) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
