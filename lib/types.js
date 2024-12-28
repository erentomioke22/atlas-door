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
    tocs:true,
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
// @lib/types.js


export function getCommentDataInclude(loggedInUserId) {
  return {
    // user: {
    //   select: getUserDataSelect(loggedInUserId),
    // },
    replies: {
      orderBy: {
        createdAt: 'desc', 
      },
      select: {
        id: true,
        content: true,
        name: true,
        email: true,
        createdAt: true,
        userId:true,
        image:true
      },
    }, 
  };
}

export function getReplyDataInclude(loggedInUserId) {
  return {
    // user: {
    //   select: getUserDataSelect(loggedInUserId),
    // },
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

