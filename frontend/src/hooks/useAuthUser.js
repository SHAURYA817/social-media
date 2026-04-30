import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
    const authUser = useQuery({
      queryKey: ['authUser'],
      queryFn: getAuthUser,
      retry: false, // to prevent retrying the request on failure 
    })

    return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
}

export default useAuthUser
