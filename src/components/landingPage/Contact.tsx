import * as React from "react";
import { ContactSection } from "./ContactSection";

export const Contact: React.FC = () => {
  const contactData = {
    title: "Connect",
    subtitle: "Get in Touch",
    description: "We're here to help! Reach out with any questions or feedback you may have.",
    contactItems: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/851bcf933131a2de96f9edb940c2ec1dfccb19c5be9048ff9259c9f814399189?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
        title: "Email",
        content: "hello@flarecast.com",
        isLink: true
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e3091f4e2b29105d3dc82716cbe49186c8459ceac39fe5be32b800321bc3f6d?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
        title: "Phone",
        content: "+1 (555) 123-4567",
        isLink: true
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/931529c983d9a40f2e9ff8fa12a9b41fb6e1942099fd6d8c5a9b976b9fe9f615?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
        title: "Office",
        content: "456 Innovation Way, San Francisco CA 94105",
        isLink: false
      }
    ]
  };

  return <ContactSection {...contactData} />;
};