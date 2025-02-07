import axiosInstance from "@/axios";
import axios from "axios";
import zod from "zod";

export const inviteMembers = async (
	workspaceId: string,
	memberEmails: string
) => {
	const emails = memberEmails.split(" ");

	emails.forEach((email) => {
		const isValidEmail = zod.object({
			email: zod.string().email("Invalid email address"),
		});

		if (!isValidEmail.safeParse({ email }).success) {
			throw new Error(`Invalid email: ${email}`);
		}
	});

	return await axiosInstance.post(
		`/api/collaboration/invitation/${workspaceId}`,
		{
			emails,
		}
	);
};

export const acceptInvitation = async (invitationId: string) => {
	return await axios.post("/api/collaboration/invitation/accept", {
		token: invitationId,
	});
};

export const rejectInvitation = async (invitationId: string) => {
	return await axios.post(`/api/collaboration/invitation/reject`, {
    token: invitationId,
  });
};
