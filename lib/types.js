export function getUserDataSelect(loggedInUserId) {
  return {
    id: true,
    name: true,
    email:true,
    image: true,
    displayName: true,
    createdAt: true,
    _count: {
      select: {
        posts: true,
      },
    },
  };
}

export function getPostDataInclude(loggedInUserId) {
  return {
    faqs:true,
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    tags:{
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

export function getProductDataInclude(loggedInUserId) {
  return {
    faqs:true,
    colors:true,
    seller: {
      select: getUserDataSelect(loggedInUserId),
    },
    cartItems: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
        colorId:true,
        quantity:true
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  };
}
// @lib/types.js


// export function getCommentDataInclude(loggedInUserId) {
//   return {
//     // user: {
//     //   select: getUserDataSelect(loggedInUserId),
//     // },
//     replies: {
//       orderBy: {
//         createdAt: 'desc', 
//       },
//       select: {
//         id: true,
//         content: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         userId:true,
//         image:true
//       },
//     }, 
//   };
// }

export function getCommentDataInclude(loggedInUserId) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    replies: {
      orderBy: {
        createdAt: 'desc', 
      },
      select: {
        id: true,
        user: true, 
        userId:true,
        parentId:true,
        replies: {
          orderBy: {
            createdAt: 'desc', 
          },
          select: {
            id: true,
            user: true, 
            userId:true,
            parentId:true,
            // replies:true,
            content: true,
            createdAt: true,
          },
        },
        content: true,
        createdAt: true,

      },
    }, 
    parent: {
      // orderBy: {
      //   createdAt: 'desc', 
      // },
      select: {
        id: true,
        user: true, 
        // userId:true,
        // parentId:true,
        content: true,
        // createdAt: true,
        // likes:true,
        // _count: {
        //   select: {
        //     likes: true,
        //   },
        // },
      },
    }, 
  };
}



export const notificationsInclude = {
  // issuer: {
  //   select: {
  //     name: true,
  //     displayName: true,
  //     image: true,
  //   },
  // },
  post: {
    select: {
      id:true,
      content: true,
      title:true,
      link:true,
      images:true,
      tags:true
    },
  },
};

