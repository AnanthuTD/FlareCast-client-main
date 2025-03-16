import { getVideoLimit } from "@/actions/subscriptions";
import { useQuery } from "@tanstack/react-query";

function useVideoLimit() {
	const { data, refetch } = useQuery({
		queryKey: ["videoLimit"],
		queryFn: getVideoLimit,
	});

	return { data, refetch };
}

export default useVideoLimit;
