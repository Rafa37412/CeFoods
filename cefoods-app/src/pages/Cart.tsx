import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart to proceed with checkout</p>
        <Link to="/" className="bg-orange-500 text-white font-medium px-6 py-2 rounded-full hover:bg-orange-600 transition">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  // Group cart items by restaurant
  const itemsByRestaurant: Record<string, typeof cartItems> = {};
  cartItems.forEach(item => {
    if (!itemsByRestaurant[item.restaurantId]) {
      itemsByRestaurant[item.restaurantId] = [];
    }
    itemsByRestaurant[item.restaurantId].push(item);
  });

  const subtotal = getTotalPrice();
  const total = subtotal;

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="lg:grid lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          {Object.entries(itemsByRestaurant).map(([restaurantId, items]) => (
            <div key={restaurantId} className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h3 className="font-semibold text-lg mb-4">{items[0].restaurantName}</h3>
              
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-shrink-0 w-20 h-20">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)} each</p>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Resumo do Pedido</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span>R${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-orange-500 text-white text-center font-semibold py-3 rounded-full hover:bg-orange-600 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
