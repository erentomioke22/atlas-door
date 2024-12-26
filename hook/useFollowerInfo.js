import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerInfo(userId,initialState) {
  const query = useQuery({
    queryKey: ["follower-info", userId],
    queryFn:async()=>{const response = await axios.get(`/api/users/${userId}/followers`);
    return response.data
   },
    initialData: initialState,
    staleTime: Infinity,
  });
  // console.log(query,userId,initialState)
  return query;
}
