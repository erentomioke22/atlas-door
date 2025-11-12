'use client';

import React, { useEffect, useState, useDeferredValue } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BiSearchAlt } from "react-icons/bi";
import LoadingSearch from "./ui/loading/loadingSearch";
import Link from 'next/link';
import ImageCom from "./ui/Image";
import Input from "./ui/input";
import DropDrawer from "./ui/dropdrawer";
import type { Session } from "@/lib/auth";

// API response types
interface PostSearchItem {
  id: string;
  slug: string;
  title: string;
  images: string[];
  user: {
    name?: string | null;
    displayName?: string | null;
  };
}

interface ProductSearchItem {
  id: string;
  name: string;
  slug: string;
  images: string[];
  seller: {
    name?: string | null;
    displayName?: string | null;
  };
}

interface SearchResponse {
  posts?: PostSearchItem[];
  products?: ProductSearchItem[];
}

interface SearchProps {
  session: Session | null;
}

const Search: React.FC<SearchProps> = ({ session }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const deferredQuery = useDeferredValue(searchValue);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  const {
    data,
    status,
    isFetching,
  } = useQuery<SearchResponse>({
    queryKey: ["data-search", deferredQuery],
    enabled: deferredQuery.length >= 1,
    queryFn: async () => {
      const response = await axios.get<SearchResponse>(
        `/api/search?searchQuery=${encodeURIComponent(deferredQuery)}`
      );
      return response.data;
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <DropDrawer
      title={<BiSearchAlt />}
      className={`${session ? '-right-[88px]' : '-right-11'} md:-right-14   w-96  px-3 max-h-96 overflow-auto`}
      btnStyle={
        "bg-lcard dark:bg-dcard dark:text-white text-lg p-2  rounded-lg text-black"
      }
    >
      <div className="space-y-5 px-2">
        <div>
          <h1 className={" text-xl "}>
            جستجو
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-black border-lbtn  rounded-lg space-x-1 ">
          <Input
            placeholder="جستجو..."
            title="جستجو..."
            type="text"
            name="search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue || ""}
          />
        </form>

        {status === "success" && !data?.posts?.length && !data?.products?.length && (
          <p className="text-center text-sm text-lfont">
            هیچ پستی با این نام هنوز وجود ندارد
          </p>
        )}

        {searchValue?.length <= 0 && !data?.posts?.length && !data?.products?.length && (
          <p className="text-center text-sm text-lfont">
            اسم مطلب یا محصولی که دنبالش هستید رو بنویسید
          </p>
        )}

        {status === "error" && (
          <p className="text-center ttext-sm text-lfont">
            مشکلی در برقراری ارتباط پیش آمده
          </p>
        )}
        <div className="relative w-full  px-3 space-y-5 ">
          {status === "pending" && isFetching
            ? Array(3)
              .fill({})
              .map((_, index) => (
                <LoadingSearch key={index} />
              )
              )
            :
            <>
              {data?.posts?.map((post) => (
                <Link href={`/posts/${post?.slug}`} key={post?.id}>
                  <div className="p-2 w-full mx-auto ">
                    <div className=' flex gap-2'>
                      <div className="relative w-[40px] h-[40px]">
                        <ImageCom src={post?.images[0]} className="rounded-lg bg-lbtn dark:bg-dbtn  h-10 w-10" alt={'thumnail'} />
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-lfont text-sm">{post?.user.displayName || post?.user.name} . <span className="text-[10px] text-red">مقاله</span></p>
                        <p className="text-sm line-clamp-1 hover:underline underline-offset-2 decoration-2 duration-100">{post?.title}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {data?.products?.map((product) => (
                <Link href={`/products/${product?.slug}`} key={product?.id}>
                  <div className="p-2 w-full mx-auto ">
                    <div className=' flex gap-2'>
                      <div className="relative w-[40px] h-[40px]">
                        <ImageCom src={product?.images[0]} className="rounded-lg bg-lbtn dark:bg-dbtn  h-10 w-10" alt={'thumnail'} />
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-lfont text-sm">{product?.seller.displayName || product?.seller.name} . <span className="text-[10px] text-red">محصول</span></p>
                        <p className="text-sm line-clamp-1 hover:underline underline-offset-2 decoration-2 duration-100">{product?.name}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          }
        </div>
      </div>
    </DropDrawer>
  );
};

export default Search;
