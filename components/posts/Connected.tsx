"use client";

import PostCard, { PostLite } from "../posts/postCard";
import LoadingCard from "../ui/loading/loadingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmblaCarousel from "../ui/carousel/carousel";

interface ConnectedProps {
  postTitle: string;
  postId: string;
}


function Conneccted({ postTitle, postId }: ConnectedProps) {
  const {
    data: posts,
    status,
    error
  } = useQuery<PostLite[], Error>({
    queryKey: ["connected-Post", postTitle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/posts/connected?postTitle=${postTitle}&postId=${postId}`
      );
      return response.data.posts;
    },
  });

  if (status === "success" && posts.length === 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        هیچ مقاله ای یافت نشد
      </p>
    );
  }

  if (status === "error" || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
    );
  }

  return (
    <div className="px-7 space-y-5">

      <EmblaCarousel options={{ loop: false, dragFree: true, direction: 'rtl' }} dot={false} autoScroll={false}>
        {status === "pending" &&
          Array(10)
            .fill({})
            .map((_, index) => {
              return (
                <div
                  className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4"
                  key={index}
                >
                  <LoadingCard />
                </div>
              );
            })}
        {posts?.map((post) => (
          <div
            className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2"
            key={post.id}
          >
            <PostCard post={post} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}

export default Conneccted;