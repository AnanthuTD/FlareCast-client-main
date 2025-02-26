import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandItem } from "@/components/ui/command";
import AvatarPlaceHolder from "../avatar-placeholder";
import { Button } from "@/components/ui/button";

interface Member {
	id: string;
	name: string;
}

const MemberItem: React.FC<{
	member: Member;
	onAdd?: () => void;
	onRemove?: () => void;
	isExisting?: boolean;
}> = ({ member, onAdd, onRemove, isExisting }) => (
	<CommandItem
		className="cursor-pointer hover:bg-gray-100 py-1.5 px-2"
		value={member.name}
	>
		<span className="flex justify-between w-full">
			<div className="flex gap-2">
				<Avatar className="w-8 h-8">
					<AvatarImage src="" />
					<AvatarFallback>
						<AvatarPlaceHolder value={member.name[0] || "A"} />
					</AvatarFallback>
				</Avatar>
				<p>{member.name}</p>
			</div>
			{isExisting && onRemove ? (
				<Button onClick={onRemove} variant="destructive" size="sm">
					Remove
				</Button>
			) : (
				onAdd && (
					<Button
						onClick={onAdd}
						className="bg-indigo-500 hover:bg-indigo-600"
						size="sm"
					>
						Add
					</Button>
				)
			)}
		</span>
	</CommandItem>
);

export default MemberItem;
