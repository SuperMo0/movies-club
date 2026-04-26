import { checkSession } from "@/api/auth.api"
import { useQuery } from "@tanstack/react-query"


export function useSession() {
    const query =
        useQuery({
            queryKey: ["session"],
            queryFn: checkSession,
            staleTime: Infinity,
            select: (d) => d.user
        })
    return query;
}