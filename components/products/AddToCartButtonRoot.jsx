import { useCart } from '@hook/useCart';
import { FaPlus ,FaMinus  } from "react-icons/fa";
import { toast } from 'sonner';

export default function AddToCartButton({ 
  product, 
  colorId, 
  session,
  className, 
  stocks = 1, 
  card = false 
}) {
  const { 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    getItemQuantity, 
    isInCart 
  } = useCart();

  const quantity = getItemQuantity(product.id, colorId);
  const inCart = isInCart(product.id, colorId);

  const handleAddToCart = () => {
    if(session){
      addToCart(product, colorId, 1);
    }else{
      toast.error('لطفا وارد حساب کاربری خود شوید')
    }
  };

  const handleRemoveFromCart = () => {
      removeFromCart(product.id, colorId);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart();
    } else if (newQuantity <= stocks) {
      updateCartQuantity(product.id, colorId, newQuantity);
    } else {
      toast.error(`فقط ${stocks} عدد موجود است`);
    }
  };

  const handleIncrement = () => {
    if (quantity < stocks) {
      handleQuantityChange(quantity + 1);
    } else {
      toast.error(`فقط ${stocks} عدد موجود است`);
    }
  };

  const handleDecrement = () => {
    handleQuantityChange(quantity - 1);
  };

  if (card) {
    return (
      <button
        onClick={inCart ? handleRemoveFromCart : handleAddToCart}
        className={`text-sm rounded-full px-3 py-2 ${
          !inCart 
            ? "bg-black text-white dark:bg-white dark:text-black border-2" 
            : "bg-transparent border-2 border-black dark:border-white"
        }`}
      >
        {!inCart ? "افزودن به سبد" : "حذف از سبد"}
      </button>
    );
  }

  if (!inCart) {
    return (
      <button 
        onClick={handleAddToCart} 
        className={`text-sm rounded-full px-3 py-2 bg-black text-white dark:bg-white dark:text-black border-2 ${className}`}
      >
        افزودن به سبد
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 ">
      <button 
        onClick={handleRemoveFromCart}
        className="p-2 rounded-full text-red border-2 bg-transparent text-sm"
      >
        حذف از سبد خرید
      </button>
      
      {quantity > 1 && (
        <button 
          onClick={handleDecrement}
          className="p-2 rounded-full border-lbtn dark:border-dbtn border-2 bg-lcard dark:bg-dcard disabled:cursor-not-allowed disabled:bg-lbtn disabled:dark:bg-dbtn"
          disabled={quantity <= 1}
        >
          <FaMinus/>
        </button>
      )}
      
      {/* <Input
        type="number"
        min="1"
        max={stocks}
        value={quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value) || 1;
          handleQuantityChange(newQuantity);
        }}
        className="w-16 text-center border rounded border-none bg-lcard dark:bg-dcard"
      /> */}

      <p className="text-lg ">{quantity}</p>
      
      <button 
        onClick={handleIncrement}
        className="p-2 rounded-full border-lbtn dark:border-dbtn border-2 bg-lcard dark:bg-dcard disabled:cursor-not-allowed disabled:bg-lbtn disabled:dark:bg-dbtn"
        disabled={quantity >= stocks || quantity >= 10}
      >
        <FaPlus/>
      </button>
    </div>
  );
}