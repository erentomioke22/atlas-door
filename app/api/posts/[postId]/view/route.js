import { prisma } from "@utils/database";
import { auth } from "@auth";




export async function GET(req,{params}) {
  try {
      const session = await auth();

    // if (!session) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const view = await prisma.view.findUnique({
      where: {
        users_postId: {
          users:{in:session.user?.id} ,
          postId:params.postId,
        },
      },
    });

    const data = {
      isViewed: !!view,
    };

    return Response.json({data});
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST(req,{params}) {
  try {
      const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.view.upsert({
      where: {
        userId_postId: {
          userId:session.user?.id,
          postId:params.postId,
        },
      },
      create: {
        userId:session.user?.id,
        postId:params.postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}




