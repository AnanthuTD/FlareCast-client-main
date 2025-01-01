export default async function Page({
	params,
}: {
	params: Promise<{ folderId: string }>;
}) {
	const folderId = (await params).folderId;

	return (
		<div>
			Folder Id: {folderId}
			<div className="flex gap-2 items-center self-stretch my-auto text-sm tracking-normal leading-6 text-center">
				<button
					className="self-stretch pt-1.5 pr-5 pb-2 pl-5 my-auto border border-solid border-gray-500 border-opacity-30 rounded-[7992px] text-neutral-800"
				>
					New folder
				</button>
				<button className="self-stretch px-5 pt-1.5 pb-2 my-auto text-white bg-indigo-500 rounded-[7992px]">
					New video
				</button>
			</div>
		</div>
	);
}
