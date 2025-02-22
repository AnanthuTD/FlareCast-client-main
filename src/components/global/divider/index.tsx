import React from "react";

function Divider({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) {
	return (
		<div
			data-orientation="horizontal"
			role="none"
			className="relative flex items-center w-full my-2"
		>
			<div className="flex-1 h-[1px] bg-border"></div>
			<span
				className="px-4 text-xs text-gray-600 whitespace-nowrap hover:cursor-pointer "
				onClick={onClick}
			>
				{children}
			</span>
			<div className="flex-1 h-[1px] bg-border"></div>
		</div>
	);
}

export default Divider;
