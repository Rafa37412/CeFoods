import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, DollarSign, CirclePlus, Star, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { restaurants, foodItems } from '../data/mockData';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    if (id) {
      const foundRestaurant = restaurants.find(r => r.id === id);
      setRestaurant(foundRestaurant);
      
      const restaurantMenu = foodItems.filter(item => item.restaurantId === id);
      setMenu(restaurantMenu);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      restaurantName: restaurant.name
    });
  };

  // Group menu items by category
  const menuByCategory: Record<string, any[]> = {};
  menu.forEach(item => {
    if (!menuByCategory[item.category]) {
      menuByCategory[item.category] = [];
    }
    menuByCategory[item.category].push(item);
  });

  return (
    <div className="pb-8">
      {/* Restaurant Header */}
      <div className="h-48 md:h-64 w-full relative mb-4">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
            <span className="flex items-center">
              <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="flex items-center">
              <Clock size={16} className="mr-1" />
              {restaurant.deliveryTime}
            </span>
            <span className="flex items-center">
              <Truck size={16} className="mr-1" />
              ${restaurant.deliveryFee.toFixed(2)}
            </span>
            <span className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              Min ${restaurant.minOrder}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Menu</h2>
        
        {Object.entries(menuByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div className="flex-shrink-0 w-24 h-24">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="text-orange-500 hover:text-orange-600 flex items-center gap-1 transition"
                      >
                        <CirclePlus size={18} />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
