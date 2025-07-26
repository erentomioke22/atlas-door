import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useTagInfo(userId,initialState) {
  const query = useQuery({
    queryKey: ["tag-info", userId],
    queryFn:async()=>{const response = await axios.get(`/api/users/${userId}/followers`);
    return response.data
   },
    initialData: initialState,
    staleTime: Infinity,
  });
  return query;
}
