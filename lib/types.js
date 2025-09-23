export function getUserDataSelect(loggedInUserId) {
  return {
    id: true,
    name: true,
    email:true,
    image: true,
    phone: true,        // اضافه کردن phone
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

export function getPostDataInclude(loggedInUserId) {
  return {
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

// export function getProductDataInclude(loggedInUserId) {
//   return {
//     colors:true,
//     seller: {
//       select: getUserDataSelect(loggedInUserId),
//     },
//     cartItems: {
//       where: {
//         userId: loggedInUserId,
//       },
//       select: {
//         userId: true,
//         colorId:true,
//         quantity:true
//       },
//     },
//     _count: {
//       select: {
//         comments: true,
//       },
//     },
//   };
// }
export function getProductDataInclude(loggedInUserId) {
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
      : false, // Do not include cartItems if not logged in
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

// export function getCommentDataInclude(loggedInUserId) {
//   return {
//     user: {
//       select: getUserDataSelect(loggedInUserId),
//     },
//     replies: {
//       orderBy: {
//         createdAt: 'desc', 
//       },
//       select: {
//         id: true,
//         user: true, 
//         userId:true,
//         parentId:true,
//         replies: {
//           orderBy: {
//             createdAt: 'desc', 
//           },
//           select: {
//             id: true,
//             user: true, 
//             userId:true,
//             parentId:true,
//             // replies:true,
//             content: true,
//             createdAt: true,
//           },
//         },
//         content: true,
//         createdAt: true,

//       },
//     }, 
//     parent: {
//       // orderBy: {
//       //   createdAt: 'desc', 
//       // },
//       select: {
//         id: true,
//         user: true, 
//         // userId:true,
//         // parentId:true,
//         content: true,
//         // createdAt: true,
//         // likes:true,
//         // _count: {
//         //   select: {
//         //     likes: true,
//         //   },
//         // },
//       },
//     }, 
//   };
// }

export function getCommentDataInclude(loggedInUserId) {
  return {
    // user: {
    //   select: getUserDataSelect(loggedInUserId),
    // },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        displayName: true
      }
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
        // name: true,
        // email: true,
        createdAt: true,
        replies: {
          orderBy: {
            createdAt: 'desc', 
          },
          select: {
            id: true,
            user: true, 
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                displayName: true
              }
            },
            parentId:true,
            content: true,
            createdAt: true,
            // replies:true,
            // userId:true,
            // likes:true,
            // _count: {
            //   select: {
            //     likes: true,
            //   },
            // },
          },
        },
        content: true,
        createdAt: true,
        // likes:true,
        // _count: {
        //   select: {
        //     likes: true,
        //   },
        // },
      },
    }, 
    parent: {
      // orderBy: {
      //   createdAt: 'desc', 
      // },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            displayName: true
          }
        },
        content: true,
        // user: true, 
        // userId:true,
        // parentId:true,
        // createdAt: true,
        // likes:true,
        // _count: {
        //   select: {
        //     likes: true,
        //   },
        // },
      },
    }, 
    // likes: {
    //   where: {
    //     userId: loggedInUserId,
    //   },
    //   select: {
    //     userId: true,
    //   },
    // },
    // _count: {
    //   select: {
    //     likes: true,
    //   },
    // },
  };
}


// export function getCommentDataInclude(loggedInUserId) {
//   return {
//     user: {
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         displayName: true
//       }
//     },
//     replies: {
//       orderBy: {
//         createdAt: 'desc'
//       },
//       select: {
//         id: true,
//         content: true,
//         createdAt: true,
//         userId: true,
//         name: true,
//         email: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             displayName: true
//           }
//         }
//       }
//     },
//     parent: {
//       select: {
//         id: true,
//         content: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             displayName: true
//           }
//         }
//       }
//     }
//   };
// }

export const notificationsInclude = {
  issuer: {
    select: {
      name: true,
      displayName: true,
      image: true,
    },
  },
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
  product: {
    select: {
      id:true,
      content: true,
      name:true,
      images:true,
    },
  },
};

