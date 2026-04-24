import { checkSession } from "@/api/auth.api"
import { useQuery } from "@tanstack/react-query"


export function useSession() {
    return useQuery({ queryKey: ["session"], queryFn: checkSession, staleTime: Infinity })
}