import type { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId?: string | null): Prisma.UserSelect {
  return {
    id: true,
    name: true,
    email: true,
    image: true,
    phone: true,
    address: true,
    displayName: true,
    createdAt: true,
    _count: {
      select: {
        posts: true,
      },
    },
  };
}

export function getPostDataInclude(loggedInUserId?: string | null): Prisma.PostInclude {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    tags: {
      select: {
        name: true,
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  };
}

export function getProductDataInclude(loggedInUserId?: string | null): Prisma.ProductInclude {
  return {
    colors: true,
    seller: {
      select: getUserDataSelect(loggedInUserId),
    },
    cartItems: loggedInUserId
      ? {
          where: {
            userId: loggedInUserId,
          },
          select: {
            userId: true,
            colorId: true,
            quantity: true,
          },
        }
      : false,
    _count: {
      select: {
        comments: true,
      },
    },
  };
}

export function getCommentDataInclude(loggedInUserId?: string | null): Prisma.CommentInclude {
  return {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        displayName: true,
      },
    },
    replies: {
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        user: true,
        userId: true,
        parentId: true,
        createdAt: true,
        replies: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            user: true,
            // user: {
            //   select: {
            //     id: true,
            //     name: true,
            //     email: true,
            //     image: true,
            //     displayName: true,
            //   },
            // },
            parentId: true,
            content: true,
            createdAt: true,
          },
        },
        content: true,
        // createdAt: true,
      },
    },
    parent: {
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            displayName: true,
          },
        },
        content: true,
      },
    },
  };
}

// export function getCommentDataInclude(loggedInUserId?: string | null): Prisma.CommentInclude {
//   return {
//     user: {
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         displayName: true,
//       },
//     },
//     replies: {
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {  // Change from 'select' to 'include' for nested relations
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             displayName: true,
//           },
//         },
//         replies: {
//           orderBy: {
//             createdAt: "desc",
//           },
//           include: {  // Change from 'select' to 'include'
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true,
//                 displayName: true,
//               },
//             },
//           },
//         },
//       },
//     },
//     parent: {
//       include: {  // Change from 'select' to 'include'
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             displayName: true,
//           },
//         },
//       },
//     },
//   };
// }
export const notificationsInclude: Prisma.NotificationInclude = {
  issuer: {
    select: {
      name: true,
      displayName: true,
      image: true,
    },
  },
  post: {
    select: {
      id: true,
      content: true,
      title: true,
      slug: true,
      images: true,
      tags: true,
    },
  },
  product: {
    select: {
      id: true,
      content: true,
      name: true,
      slug: true,
      images: true,
    },
  },
};

