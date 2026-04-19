import { checkSession } from "@/api/auth"
import { useQuery } from "@tanstack/react-query"


export function useSession() {
    return useQuery({ queryKey: ["session"], queryFn: checkSession, staleTime: Infinity })
}