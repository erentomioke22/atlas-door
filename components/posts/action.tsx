"use server";

import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { utapi } from "@/server/uploadthing";

type SubmitPostValues = {
  title: string;
  desc: string;
  images: string[];
  content: unknown;
  tags?: (string | undefined)[];
  scheduledPublish?: string | null;
};

export async function submitPost(values: SubmitPostValues) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const existPost = await prisma.post.findMany({
      where: {
        title: values.title,
        userId: session?.user?.id,
      },
    });
    if (existPost.length >= 1) {
      throw new Error("محصولی با این نام وجود دارد");
    }

    let sanitizedTitle = values.title.replace(/\s+/g, "-").toLowerCase();
    const randomString = Math.random().toString(36).substring(2, 12);
    sanitizedTitle += `_${randomString}`;

    const tags =
      values.tags?.filter((tag): tag is string => tag !== undefined) || [];

    const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags,
        },
      },
    });

    const newPost = await prisma.post.create({
      data: {
        title: values.title,
        link: sanitizedTitle,
        desc: values.desc,
        images: values.images,
        content: values.content as any,
        userId: session?.user?.id!,
        tags: {
          connect: existingTags.map((tag: { id: string }) => ({ id: tag.id })),
          create: tags
            .filter(
              (tagName) =>
                !existingTags.some(
                  (tag: { name: string }) => tag.name === tagName
                )
            )
            .map((tagName) => ({ name: tagName })),
        },
        status:
          values.scheduledPublish &&
          new Date(values.scheduledPublish) > new Date()
            ? "SCHEDULED"
            : "PUBLISHED",
        ...(values.scheduledPublish &&
          new Date(values.scheduledPublish) > new Date() && {
            expiresAt: new Date(values.scheduledPublish),
          }),
      },
      include: getPostDataInclude(session?.user?.id),
    });

    if (!newPost) throw new Error("Failed to create the post");

    return newPost;
  } catch (err: any) {
    throw new Error(err);
  }
}

type EditPostValues = {
  postId: string;
  title: string;
  desc: string;
  images: string[];
  content: unknown;
  tags?: (string | undefined)[];
  rmFiles: string[];
};

export async function editPost(values: EditPostValues) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    let sanitizedTitle = values.title.replace(/\s+/g, "-").toLowerCase();
    const randomString = Math.random().toString(36).substring(2, 12);
    sanitizedTitle += `_${randomString}`;

    const tags =
      values.tags?.filter((tag): tag is string => tag !== undefined) || [];

    if (values.rmFiles.length > 0) {
      try {
        await utapi.deleteFiles(values.rmFiles);
      } catch (err) {
        console.error(err);
        throw new Error("field to delete archive image");
      }
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags,
        },
      },
    });

    const newPost = await prisma.post.update({
      where: { id: values.postId },
      data: {
        title: values.title,
        link: sanitizedTitle,
        desc: values.desc,
        images: values.images,
        content: values.content as any,
        userId: session?.user?.id,
        tags: {
          set: [],
          connect: existingTags.map((tag: { id: string }) => ({ id: tag.id })),
          create: tags
            .filter(
              (tagName) =>
                !existingTags.some(
                  (tag: { name: string }) => tag.name === tagName
                )
            )
            .map((tagName) => ({ name: tagName })),
        },
      },
      include: getPostDataInclude(session?.user?.id),
    });

    return newPost;
  } catch (error: any) {
    throw new Error(error);
  }
}

type DeletePostValues = {
  id: string;
  removeKey: string[];
};

export async function deletePost(values: DeletePostValues) {
  try {
    const id = values.id;

    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) throw new Error("Post not found");

    if (post.userId !== session?.user?.id) throw new Error("Unauthorized");

    if (values.removeKey.length > 0) {
      try {
        await utapi.deleteFiles(values.removeKey);
      } catch (err) {
        console.error(err);
        throw new Error("field to delete archive image");
      }
    }

    const deletedPost = await prisma.post.delete({
      where: { id },
      include: getPostDataInclude(session?.user?.id),
    });

    return deletedPost;
  } catch (error: any) {
    throw new Error(error);
  }
}
