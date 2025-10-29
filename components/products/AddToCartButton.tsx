import axios from "axios";
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import { IoBookmarkOutline } from "react-icons/io5";
import {toast} from 'sonner'
import { useState, useEffect, useRef } from "react";
import {Input} from "@components/ui/input";
import { formatNumber } from "@lib/utils";

export default function AddToCartButton({productId,initialState,name,className,stocks = 1,setPrice,price,card=false,colorId}) {
  const [quantity, setQuantity] = useState(initialState?.quantity || 1);
  const [inputValue, setInputValue] = useState(initialState?.quantity || 1);
  const queryClient = useQueryClient();
  const queryKey = ["cart-info", productId,colorId];
  const debounceTimer = useRef(null);
  const isUpdating = useRef(false);

  


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

    queryClient.setQueryData(["product-feed", "orders"], (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        orders: oldData.orders.map(order => {
          if (order.product.id === productId && order.colorId === colorId) {
            return { ...order, quantity: newQuantity };
          }
          return order;
        })
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



useEffect(() => {
  const newQuantity = initialState?.quantity || 1;
  setQuantity(newQuantity);
  setInputValue(newQuantity);
}, [colorId, initialState?.quantity]);



const { data,isLoading } = useQuery({
  queryKey : ["cart-info",productId,colorId],
  queryFn: async () => {
    const response = await axios.get(`/api/product/addToBag?productId=${productId}&colorId=${colorId}`);
    return response.data;
  },
  initialData: initialState,
  staleTime: 0,
});



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
    
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        data: {
          ...old?.data,
          isCarted: true,
          quantity: 1
        }
      }));
      
      queryClient.setQueryData(["product", name], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          cartItems: [
            ...oldData.cartItems,
            {
              userId: initialState.userId,
              colorId: colorId,
              quantity: 1
            }
          ]
        };
      });
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries(["product", name]);
    }
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
      queryClient.setQueryData(queryKey, (old) => ({
        ...old,
        data: {
          ...old?.data,
          isCarted: false,
          quantity: 0
        }
      }));
      queryClient.setQueryData(["product", name], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          cartItems: oldData.cartItems.filter(
            item => !(item.userId === initialState.userId && item.colorId === colorId)
          )
        };
      });
      setQuantity(1);
      setInputValue(1);
      // updateProductFeedData(0);
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast.error(error?.response?.data.error || "Something went wrong. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries(["product", name]);
    }
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
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      setQuantity(1);
      setInputValue(1);
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
        className={`text-sm rounded-full px-3 py-2 bg-black text-white dark:bg-white dark:text-black border-2 ${className}`}>
        Add to Cart
      </button>
    );
  }

  return (
      <div className="flex items-center  gap-2 bg-lcard dark:bg-dcard  px-2 rounded-xl">
      <button 
        onClick={()=>{removeItem()}}
        className="px-2 bg-gray-200 rounded text-red bg-lbtn dark:bg-dbtn disabled:cursor-not-allowed"
        disabled={isUpdating.current}
      >
       × 
      </button>
{quantity > 1 &&
      <button 
        onClick={handleDecrement}
        className="px-2 bg-gray-200 rounded text-lfont bg-lbtn dark:bg-dbtn disabled:cursor-not-allowed"
        disabled={isUpdating.current}
      >
         -
      </button>}
      <Input
        type="number"
        min="1"
        max={stocks}
        value={inputValue}
        // onChange={handleQuantityChange}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={handleQuantityChange}
        className="w-16  text-center border rounded border-none bg-lbtn dark:bg-dbtn"
        disabled={isUpdating.current}
      />
      <button 
        onClick={handleIncrement}
        className="px-2 bg-gray-200 rounded text-lfont bg-lbtn dark:bg-dbtn disabled:cursor-not-allowed "
        disabled={isUpdating.current || quantity >= stocks}
      >
        +
      </button>
      </div>

  );
}