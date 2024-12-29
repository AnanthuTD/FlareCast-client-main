import {
	useMutation,
	MutationKey,
	useQueryClient,
	MutationFunction,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
	mutationKey: MutationKey,
	mutationFn: MutationFunction<any, any>,
	queryKey?: string,
	onSuccess?: () => void
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey,
		mutationFn,
		onSuccess: (data) => {
			if (onSuccess) {
				onSuccess();
				return toast.success(data.status === 200 ? "Success" : "Error", {
					description: data.message,
				});
			}
		},
		onSettled: async () => {
			if (queryKey) {
				await queryClient.invalidateQueries({ queryKey: [queryKey] });
			}
		},
		onError: (error) => {
			toast.error("Error", { description: error.message });
		},
	});
};
