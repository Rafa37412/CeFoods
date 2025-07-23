import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useCart();
  const { currentUser } = useAuth();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-50 bg-red-600 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-white mr-1" />
            <div className="text-xl font-bold text-white">
              CEFOODS
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center bg-yellow-300 rounded-full px-3 py-1">
                <span className="text-red-600 font-bold">R${currentUser?.balance.toFixed(2)}</span>
              </div>
            )}
            <Link to="/cart" className="relative">
              <div className="bg-yellow-300 w-10 h-10 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-red-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-red-600">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
