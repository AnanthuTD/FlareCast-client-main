import React from "react";
import { TestimonialCard } from "./TestimonialCard";

function Testimonial() {
	const testimonials = [
		{
			rating: 3,
			quote:
				"FlareCast's real-time features have made collaboration effortless. It's a game changer for our remote team!",
			author: "Alice Johnson",
			position: "Project Manager",
			company: "TechCorp",
			avatar:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/0e127919866cf52a083f981f7d10659b41983974778b35d520f4e81dd25c0ae6?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			companyLogo:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/5064ab20f55e69227839c8a29ac72ce2fc8950e197fe3fbd24c5b1e1e7d047ae?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		},
		{
			rating: 3,
			quote:
				"The AI transcription feature saves us so much time. I can't imagine working without it!",
			author: "Mark Stevens",
			position: "CEO",
			company: "InnovateX",
			avatar:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/0e127919866cf52a083f981f7d10659b41983974778b35d520f4e81dd25c0ae6?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
			companyLogo:
				"https://cdn.builder.io/api/v1/image/assets/TEMP/5064ab20f55e69227839c8a29ac72ce2fc8950e197fe3fbd24c5b1e1e7d047ae?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec",
		},
	];

	return testimonials.map((testimonial, index) => (
		<TestimonialCard key={index} {...testimonial} />
	));
}

export default Testimonial;
