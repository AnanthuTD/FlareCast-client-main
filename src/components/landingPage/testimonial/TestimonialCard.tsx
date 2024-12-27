import * as React from "react";
import { TestimonialProps } from "../../../types";

export const TestimonialCard: React.FC<TestimonialProps> = ({
	rating,
	quote,
	author,
	position,
	company,
	avatar,
	companyLogo,
}) => {
	return (
		<div className="flex overflow-hidden flex-col flex-1 shrink items-start basis-0 min-w-[240px] max-md:max-w-full">
			<div className="flex overflow-hidden gap-1 items-start">
				{[...Array(5)].map((_, i) => (
					<img
						key={i}
						loading="lazy"
						src={
							i < rating
								? "https://cdn.builder.io/api/v1/image/assets/TEMP/7e4df2cd1a7939a31855fa8e82b1b9421fc9a6af4643291313cbb9984d060bb0?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
								: "https://cdn.builder.io/api/v1/image/assets/TEMP/83f3e69b86bf8ad599b9ef8530cabb2e2ef9cd8b64327ff462cd47fb16eccadd?placeholderIfAbsent=true&apiKey=c5dccb8c30704e8b9e01b46fd4eecdec"
						}
						alt={i < rating ? "Filled star" : "Empty star"}
						className="object-contain shrink-0 w-5 aspect-[1.05]"
					/>
				))}
			</div>
			<div className="self-stretch mt-8 text-xl font-bold leading-7 text-black max-md:max-w-full">
				{quote}
			</div>
			<div className="flex gap-5 items-center mt-8 text-base text-black max-md:max-w-full">
				<img
					loading="lazy"
					src={avatar}
					alt={`${author}'s profile`}
					className="object-contain shrink-0 self-stretch my-auto w-14 rounded-full aspect-square"
				/>
				<div className="flex flex-col self-stretch my-auto">
					<div className="font-semibold">{author}</div>
					<div>
						{position}, {company}
					</div>
				</div>
				<div className="shrink-0 self-stretch my-auto w-0 border border-black border-solid h-[61px]" />
				<img
					loading="lazy"
					src={companyLogo}
					alt={`${company} logo`}
					className="object-contain shrink-0 self-stretch my-auto aspect-[2.5] w-[120px]"
				/>
			</div>
		</div>
	);
};
