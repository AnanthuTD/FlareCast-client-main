import {
	useMutation,
	MutationKey,
	useQueryClient,
	MutationFunction,
	useMutationState,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
	mutationKey: MutationKey,
	mutationFn: MutationFunction<any, any>,
	queryKey?: string,
	onSuccess?: (data: any, variable: any, context: unknown) => void,
	onError?:
		| ((
				error: Error,
				variables: any,
				context: unknown
		  ) => Promise<unknown> | unknown)
		| undefined
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey,
		mutationFn,
		onSuccess: (data, variable, context) => {
			if (onSuccess) {
				onSuccess(data, variable, context);
				return toast.success("Success", {
					description: data.message,
				});
			}
		},
		onSettled: async () => {
			if (queryKey) {
				await queryClient.invalidateQueries({ queryKey: [queryKey] });
			}
		},
		onError: (error, variable, context) => {
			onError?.(error, variable, context);
			toast.error("Error", { description: error.message });
		},
	});
};

export const useMutationDataState = (mutationKey: MutationKey) => {
	const data = useMutationState({
		filters: { mutationKey },
		select(mutation) {
			return {
				variables: mutation.state.variables as any,
				status: mutation.state.status,
			};
		},
	});

	const latestVariables = data[data.length - 1];
	return { latestVariables };
};
