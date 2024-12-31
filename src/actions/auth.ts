import axiosInstance from "@/axios";

export const checkUserExists = async ({ email }: { email: string }) => {
	try {
		const response = await axiosInstance.get(
			`/api/user/auth/user-exist?email=${email}`
		);
		return response.data;
	} catch (error) {
		return error.response.data;
	}
};

export const signInWithCredential = async (
	email: string,
	password: string
): Promise<
	| {
			accessToken: string;
			firstName: string;
			lastName: string;
			image: string;
			id: string;
			email: string;
	  }
	| never
> => {
	try {
		const response = await axiosInstance.post(`/api/user/auth/sign-in`, {
			email,
			password,
		});
		return { ...response.data, error: false };
	} catch (error) {
		throw error.response?.data.message;
	}
};

export const signUp = async ({
	email,
	firstName,
	lastName,
	password,
}: {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}) => {
	try {
		const response = await axiosInstance.post(`/api/user/auth/sign-up`, {
			email,
			firstName,
			lastName,
			password,
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response.data.message);
	}
};
