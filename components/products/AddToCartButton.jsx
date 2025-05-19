// import axios from "axios";
// import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
// import { IoBookmarkOutline , IoBookmark } from "react-icons/io5";
// import {toast} from 'sonner'



// export default function AddToCartButton({productId,initialState,name,className}) {

//   const queryClient = useQueryClient();

//   const queryKey = ["cart-info", productId];

//   const { data } = useQuery({
//     queryKey,
//     queryFn: () =>
//       axios.get(`/api/products/${productId}/addToBag`).json(),
//     initialData: initialState,
//     staleTime: Infinity,
//   });



//   const { mutate } = useMutation({
//     mutationFn: () =>
//       data.isCarted
//         ? axios.delete(`/api/product/${productId}/addToBag`)
//         : axios.post(`/api/product/${productId}/addToBag`),
//     onMutate: async () => {
//       toast.success(`product ${data.isCarted ? "un" : ""}add to bagged`);
     
//       await queryClient.cancelQueries({ queryKey });

//       const previousState = queryClient.getQueryData(queryKey);

//       queryClient.setQueryData(queryKey, () => ({
//         isCarted: !previousState?.isCarted,
//       }));

//       return { previousState };
//     },
//     onError(error, variables, context) {
//       queryClient.setQueryData(queryKey, context?.previousState);
//       console.error(error);
//       toast.error( "Something went wrong. Please try again.");
//     },
//   });

//   return (
//     <button onClick={() => mutate()} 
//     className={className} 
//     >
//     {/* <span className='text-[12px]'>{name}</span> */}
//     {data.isCarted ? <IoBookmark /> : <IoBookmarkOutline /> } 
//     </button>
//   );
// }






// import axios from "axios";
// import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
// import { IoBookmarkOutline } from "react-icons/io5";
// import {toast} from 'sonner'
// import { useState, useEffect, useRef } from "react";

// export default function AddToCartButton({productId,initialState,name,className,stocks = 1,setPrice,price,card=false,colorId}) {
//   const [quantity, setQuantity] = useState(initialState?.quantity || 1);
//   const [inputValue, setInputValue] = useState(initialState?.quantity || 1);
//   const queryClient = useQueryClient();
//   const queryKey = ["cart-info", productId];
//   const debounceTimer = useRef(null);
//   const isUpdating = useRef(false);
// console.log(stocks,initialState)
//   // Cleanup on unmount
  
  
//   const updateProductFeedData = (newQuantity) => {
//     queryClient.setQueryData(["product-feed", "orders"], (oldData) => {
//       if (!oldData) return oldData;
      
//       return {
//         ...oldData,
//         orders: oldData.orders.map(order => {
//           if (order.product.id === productId) {
//             return {
//               ...order,
//               product: {
//                 ...order.product,
//                 cartItems: order.product.cartItems.map(cartItem => {
//                   if (cartItem.userId === initialState.userId) {
//                     return { ...cartItem, quantity: newQuantity };
//                   }
//                   return cartItem;
//                 })
//               }
//             };
//           }
//           return order;
//         })
//       };
//     });
//   };
  
//   useEffect(() => {
//     return () => {
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//     };
//   }, []);




// // useEffect(()=>{
// //   setPrice(inputValue * price)
// // },[inputValue])

//   const { data } = useQuery({
//     queryKey,
//     queryFn: () =>
//       axios.get(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`).json(),
//     initialData: initialState,
//     staleTime: Infinity,
//   });

//   const { mutate: addToCart } = useMutation({
//     mutationFn: () =>
//       axios.post(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`),
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousState = queryClient.getQueryData(queryKey);
//       queryClient.setQueryData(queryKey, () => ({
//         isCarted: true,
//         quantity: 1,
//       }));
//       return { previousState };
//     },
//     onError(error, variables, context) {
//       queryClient.setQueryData(queryKey, context?.previousState);
//       console.error(error);
//       toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
//     },
//   });

//   const { mutate: updateQuantity } = useMutation({
//     mutationFn: async (newQuantity) => {
//       if (isUpdating.current) {
//         throw new Error('Update in progress');
//       }
//       isUpdating.current = true;
//       try {
//         await axios.put(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`, { quantity: newQuantity });
//       }
//       // catch (error) {
//       //   // If it's a stock error (400 status), throw the error message
//       //   if (error.response?.status === 400) {
//       //     throw new Error(error.response.data.error);
//       //   }
//       //   throw error;
//       // }
//          finally {
//         isUpdating.current = false;
//       }
//     },
//     onMutate: async (newQuantity) => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousState = queryClient.getQueryData(queryKey);
//       queryClient.setQueryData(queryKey, () => ({
//         ...previousState,
//         quantity: newQuantity,
//       }));
//       updateProductFeedData(newQuantity);
//       return { previousState };
//     },
//     onError(error, variables, context) {
//       if (error.message !== 'Update in progress') {
//         queryClient.setQueryData(queryKey, context?.previousState);
//         console.error(error.response.data.error);
//         toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
//       }
//     },
//   });

//   const { mutate: removeItem } = useMutation({
//     mutationFn: async () => {
//       // Cancel any pending updates before removing
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//       // Wait for any in-progress updates to complete
//       if (isUpdating.current) {
//         await new Promise(resolve => setTimeout(resolve, 100));
//       }
//       return axios.delete(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`);
//     },
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousState = queryClient.getQueryData(queryKey);
//       queryClient.setQueryData(queryKey, () => ({
//         isCarted: false,
//         quantity: 0,
//       }));
//       updateProductFeedData(0);
//       return { previousState };
//     },
//     onError(error, variables, context) {
//       queryClient.setQueryData(queryKey, context?.previousState);
//       console.error(error);
//       toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
//     },
//   });

//   const debouncedUpdateQuantity = (newQuantity) => {
//     if (debounceTimer.current) {
//       clearTimeout(debounceTimer.current);
//     }
    
//     debounceTimer.current = setTimeout(() => {
//       updateQuantity(newQuantity);
//     }, 500); // 500ms debounce delay
//   };




//   const handleQuantityChange = (e) => {
//     let newValue = parseInt(e.target.value) || 1;
//     if (newValue > stocks) {
//       newValue = stocks;
//       toast.error(`Only ${stocks} items available in stock`);
//     }
//     if (newValue < 1) newValue = 1;
//     setInputValue(newValue);
//     setQuantity(newValue);
//     debouncedUpdateQuantity(newValue);
//   };

//   const handleIncrement = () => {
//     if (quantity < stocks) {
//       const newQuantity = quantity + 1;
//       setQuantity(newQuantity);
//       setInputValue(newQuantity);
//       debouncedUpdateQuantity(newQuantity);
//     } else {
//       toast.error(`Only ${stocks} items available in stock`);
//     }
//   };
//   const handleDecrement = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       setQuantity(newQuantity);
//       setInputValue(newQuantity);
//       debouncedUpdateQuantity(newQuantity);
//     } else {
//       // For removal, we don't debounce and cancel any pending updates
//       if (debounceTimer.current) {
//         clearTimeout(debounceTimer.current);
//       }
//       removeItem();
//     }
//   };

// if(card){
//   return(
//     <button
//      onClick={()=>{!data.isCarted ? addToCart() : removeItem()}}
//      className={`text-sm rounded-full px-3 py-2 ${!data.isCarted ? "bg-black text-white dark:bg-white dark:text-black border-2" : "bg-transparent border-2 border-black dark:border-white"}`}>
//       {!data.isCarted ? "Add to Cart" : "Remove Of Cart"}
//     </button>
//   )
// }


//   if (!data.isCarted) {
//     return (
//       <button 
//         onClick={() => addToCart()} 
//         className={className}
//       >
//         <IoBookmarkOutline />
//       </button>
//     );
//   }

//   return (
//     <div className="flex items-center gap-2">
//       <button 
//         onClick={handleDecrement}
//         className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//         disabled={isUpdating.current}
//       >
//         {quantity === 1 ? "×" : "-"}
//       </button>
//       <input
//         type="number"
//         min="1"
//         max={stocks}
//         value={inputValue}
//         onChange={handleQuantityChange}
//         className="w-16 px-2 py-1 text-center border rounded"
//         disabled={isUpdating.current}
//       />
//       <button 
//         onClick={handleIncrement}
//         className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
//         disabled={isUpdating.current}
//       >
//         +
//       </button>
//     </div>
//   );
// }




import axios from "axios";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import { IoBookmarkOutline } from "react-icons/io5";
import {toast} from 'sonner'
import { useState, useEffect, useRef } from "react";

export default function AddToCartButton({productId,initialState,name,className,stocks = 1,setPrice,price,card=false,colorId}) {
  const [quantity, setQuantity] = useState(initialState?.quantity || 1);
  const [inputValue, setInputValue] = useState(initialState?.quantity || 1);
  const queryClient = useQueryClient();
  const queryKey = ["cart-info", productId,colorId];
  const debounceTimer = useRef(null);
  const isUpdating = useRef(false);
console.log(stocks,initialState,quantity
  ,inputValue)
  // Cleanup on unmount
  // useEffect(() => {
  //   const newQuantity = initialState?.quantity || 1;
  //   setQuantity(newQuantity);
  //   setInputValue(newQuantity);
  // }, [colorId, initialState?.quantity]);
  
  // const updateProductFeedData = (newQuantity) => {
  //   queryClient.setQueryData(["product-feed", "orders"], (oldData) => {
  //     if (!oldData) return oldData;
      
  //     return {
  //       ...oldData,
  //       orders: oldData.orders.map(order => {
  //         if (order.product.id === productId) {
  //           return {
  //             ...order,
  //             product: {
  //               ...order.product,
  //               cartItems: order.product.cartItems.map(cartItem => {
  //                 if (cartItem.userId === initialState.userId && cartItem.colorId === colorId) {
  //                   return { ...cartItem, quantity: newQuantity };
  //                 }
  //                 return cartItem;
  //               })
  //             }
  //           };
  //         }
  //         return order;
  //       })
  //     };
  //   });
  // };
  const updateProductFeedData = (newQuantity) => {
    queryClient.setQueryData(["product", name], (oldData) => {
      if (!oldData) return oldData;
      
      return {
        ...oldData,
        cartItems: oldData.cartItems.map(cartItem => {
          if (cartItem.userId === initialState.userId && cartItem.colorId === colorId) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        })
      };
    });
  
    // Also update the cart-info query
    queryClient.setQueryData(["cart-info", productId, colorId], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          isCarted: true,
          quantity: newQuantity
        }
      };
    });
  };
  
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);




// useEffect(()=>{
//   setPrice(inputValue * price)
// },[inputValue])
useEffect(() => {
  const newQuantity = initialState?.quantity || 1;
  setQuantity(newQuantity);
  setInputValue(newQuantity);
}, [colorId, initialState?.quantity]);

const { data, isLoading } = useQuery({
  queryKey: ["cart-info", productId, colorId],
  queryFn: async () => {
    const response = await axios.get(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`);
    return response.data;
  },
  initialData: initialState,
  staleTime: 0,
});


  // const { data, isLoading } = useQuery({
  //   queryKey: ["cart-info", productId, colorId],
  //   queryFn: async () => {
  //     const response = await axios.get(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`);
  //     return response.data;
  //   },
  //   initialData: initialState,
  //   staleTime: 0, // Remove Infinity to allow refetching
  // });

  // ... rest of your existing code ...

  // if (isLoading) {
  //   return <div>Loading...</div>; // Or your loading component
  // }

  const { mutate: addToCart } = useMutation({
    mutationFn: () =>
      axios.post(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, () => ({
        isCarted: true,
        quantity: 1,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
    },
  });

  const { mutate: updateQuantity } = useMutation({
    mutationFn: async (newQuantity) => {
      if (isUpdating.current) {
        throw new Error('Update in progress');
      }
      isUpdating.current = true;
      try {
        await axios.put(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`, { quantity: newQuantity });
      }
      // catch (error) {
      //   // If it's a stock error (400 status), throw the error message
      //   if (error.response?.status === 400) {
      //     throw new Error(error.response.data.error);
      //   }
      //   throw error;
      // }
         finally {
        isUpdating.current = false;
      }
    },
    onMutate: async (newQuantity) => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData(queryKey);
      // queryClient.setQueryData(queryKey, () => ({
      //   ...previousState,
      //   quantity: newQuantity,
      // }));
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        data: {
          ...old.data,
          isCarted: true,
          quantity: newQuantity
        }
      }));
      updateProductFeedData(newQuantity);
      return { previousState };
    },
    onError(error, variables, context) {
      if (error.message !== 'Update in progress') {
        queryClient.setQueryData(queryKey, context?.previousState);
        console.error(error.response.data.error);
        toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: async () => {
      // Cancel any pending updates before removing
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      // Wait for any in-progress updates to complete
      if (isUpdating.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return axios.delete(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, () => ({
        isCarted: false,
        quantity: 0,
      }));
      updateProductFeedData(0);
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
    },
  });

  const debouncedUpdateQuantity = (newQuantity) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      updateQuantity(newQuantity);
    }, 500); // 500ms debounce delay
  };




  const handleQuantityChange = (e) => {
    let newValue = parseInt(e.target.value) || 1;
    if (newValue > stocks) {
      newValue = stocks;
      toast.error(`Only ${stocks} items available in stock`);
    }
    if (newValue < 1) newValue = 1;
    setInputValue(newValue);
    setQuantity(newValue);
    debouncedUpdateQuantity(newValue);
  };

  const handleIncrement = () => {
    if (quantity < stocks) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity);
      debouncedUpdateQuantity(newQuantity);
    } else {
      toast.error(`Only ${stocks} items available in stock`);
    }
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity);
      debouncedUpdateQuantity(newQuantity);
    } else {
      // For removal, we don't debounce and cancel any pending updates
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      removeItem();
    }
  };

if(card){
  return(
    <button
     onClick={()=>{!data.isCarted ? addToCart() : removeItem()}}
     className={`text-sm rounded-full px-3 py-2 ${!data.isCarted ? "bg-black text-white dark:bg-white dark:text-black border-2" : "bg-transparent border-2 border-black dark:border-white"}`}>
      {!data.isCarted ? "Add to Cart" : "Remove Of Cart"}
    </button>
  )
}


  if (!data?.data?.isCarted) {
    return (
      <button 
        onClick={() => addToCart()} 
        className={className}
      >
        <IoBookmarkOutline />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleDecrement}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        disabled={isUpdating.current}
      >
        {quantity === 1 ? "×" : "-"}
      </button>
      <input
        type="number"
        min="1"
        max={stocks}
        value={inputValue}
        onChange={handleQuantityChange}
        className="w-16 px-2 py-1 text-center border rounded"
        disabled={isUpdating.current}
      />
      <button 
        onClick={handleIncrement}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        disabled={isUpdating.current}
      >
        +
      </button>
    </div>
  );
}