"use client";

import React, { useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { IoShareOutline } from "react-icons/io5";
import { FaArrowLeftLong, FaPhone, FaRegClock } from "react-icons/fa6";
import { toast } from "sonner";
import moment from "moment-jalaali";

import ProgressBar from "@/components/ui/progressbar";
import Button from "@/components/ui/button";
import Comments from "@/components/comments/comments";
import TableOfContents from "@/components/posts/TocPost";
import RelatedPosts from "@/components/posts/Connected";
import { PostFull } from "@/lib/types";
import { portableTextComponents } from "@/lib/portableTextComponents";
import type { Session } from "@/lib/auth";

moment.loadPersian({ usePersianDigits: true });

interface PostPageProps {
  initialPost: PostFull;
  session: Session | null;
}

export default function PostPage({
  initialPost: post,
  session,
}: PostPageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // ====== زمان مطالعه ======
  const readingTime = useMemo(() => {
    if (post.readingTime) return post.readingTime;
    const text =
      post.content
        ?.filter((block: any) => block._type === "block")
        .map((block: any) => block.children?.map((c: any) => c.text).join(" "))
        .join(" ") || "";
    return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
  }, [post.content, post.readingTime]);

  // ====== اشتراک‌گذاری ======
  const handleShare = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.desc || "",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("لینک کپی شد");
      }
    } catch {
      // کاربر لغو کرد
    }
  };

  // ====== تماس ======
  const handleCall = () => {
    toast.success("شماره کپی شد");
    navigator.clipboard.writeText("09901196140");
  };

  const formattedDate = post.publishedAt
    ? moment(post.publishedAt).locale("fa").fromNow()
    : "تاریخ نامعتبر";

  return (
    <>
      <ProgressBar />

      <div className="container max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8 mt-16">
        {/* ====== دکمه بازگشت ====== */}
        <Button
          variant="back"
          onClick={() => router.back()}
          className="mb-6 text-sm flex"
        >
          بازگشت
          <FaArrowLeftLong className="ml-2 my-auto" />
        </Button>

        {/* ====== هدر مقاله ====== */}
        <header className="space-y-5">
          <div className="space-y-5 md:mt-7">
            <div className="space-y-3">
              <h1 className="text-xl md:text-4xl w-full wrap-break-word text-black dark:text-white leading-8 md:leading-[60px]">
                {post.title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag._id}
                      href={`/posts?tag=${tag.slug}`}
                      className="text-[10px] md:text-[13px] text-neutral-500 dark:text-neutral-400 text-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span className="text-black dark:text-white">#</span>{" "}
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ====== اطلاعات نویسنده و دکمه‌ها ====== */}
          <div className="flex justify-between flex-wrap gap-3">
            <div className="flex gap-1 sm:gap-2 w-fit p-1 text-[10px] duration-300 rounded-lg truncate">
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-linear-to-tr from-redorange to-yellow" />
              )}
              <div className="flex-1 truncate">
                <p className="truncate capitalize text-sm">
                  {post.author?.name || "ناشناس"}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-300">
                  <time dateTime={post.publishedAt}>{formattedDate}</time>
                  <span>-</span>
                  <span className="flex items-center gap-1">
                    <FaRegClock className="text-[10px]" />
                    {readingTime} دقیقه مطالعه
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 my-auto">
              <button
                onClick={handleCall}
                title="تماس"
                aria-label="تماس"
                className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg hover:scale-110 transition-transform"
              >
                <FaPhone />
              </button>

              <button
                onClick={handleShare}
                aria-label="اشتراک‌گذاری"
                title="اشتراک‌گذاری"
                className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg hover:scale-110 transition-transform"
              >
                <IoShareOutline />
              </button>

              <Comments
                target={{
                  targetType: 'post',
                  targetId: post._id,
                  targetOwnerId: post.author?._id,
                  discussions: post.discussions,
                }}
                session={session}
                />
              <TableOfContents content={post.content} postId={post._id} />
            </div>
          </div>
        </header>

        {/* ====== تصویر اصلی ====== */}
        {post.mainImage && (
          <div className="relative w-full aspect-[16/9] my-8 rounded-2xl overflow-hidden">
            <Image
              src={post.mainImage}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
        )}

        {/* ====== محتوای مقاله ====== */}
        <article
          ref={contentRef}
          className="content wrap-break-word w-full normal-case leading-relaxed md:text-lg max-md:text-sm prose prose-lg dark:prose-invert max-w-none my-12"
        >
          <PortableText
            value={post.content}
            components={portableTextComponents}
          />
        </article>

        {/* ====== مقالات مرتبط ====== */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="space-y-10">
            <div>
              <h2 className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300">
                <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">
                  مقاله‌های
                </span>{" "}
                محبوب و مرتبط
              </h2>
              <p className="text-md text-neutral-500 dark:text-neutral-300">
                با دیدن مطالب ما می‌توانید با خدمات و محصولات ما آشنا شوید و
                نحوه کارکرد و نوع استفاده از آن‌ها را یاد بگیرید
              </p>
            </div>

            <RelatedPosts posts={post.relatedPosts} />
          </section>
        )}
      </div>
    </>
  );
}
