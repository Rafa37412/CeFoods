import { House, Search, ShoppingBag, Store, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t w-full">
      <div className="flex justify-around items-center py-2">
        <Link 
          to="/" 
          className={`flex flex-col items-center p-2 rounded-full ${isActive('/') ? 'bg-yellow-300' : ''}`}
        >
          <House size={24} className={isActive('/') ? 'text-red-600' : 'text-gray-500'} />
        </Link>
        
        <Link 
          to="/search" 
          className={`flex flex-col items-center p-2 rounded-full ${isActive('/search') ? 'bg-yellow-300' : ''}`}
        >
          <Search size={24} className={isActive('/search') ? 'text-red-600' : 'text-gray-500'} />
        </Link>
        
        <Link 
          to="/store" 
          className={`flex flex-col items-center p-2 rounded-full ${isActive('/store') ? 'bg-yellow-300' : ''}`}
        >
          <Store size={24} className={isActive('/store') ? 'text-red-600' : 'text-gray-500'} />
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center p-2 rounded-full ${isActive('/profile') ? 'bg-yellow-300' : ''}`}
        >
          <User size={24} className={isActive('/profile') ? 'text-red-600' : 'text-gray-500'} />
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
