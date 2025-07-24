import { useState, useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products as defaultProducts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const history = useHistory();
  
  useEffect(() => {
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem('products');
    const productsData = storedProducts ? JSON.parse(storedProducts) : defaultProducts;
    
    const foundProduct = productsData.find((p: any) => p.id === id);
    setProduct(foundProduct);
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-red-600 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Produto não encontrado</h2>
          <Link to="/" className="bg-yellow-300 hover:bg-yellow-400 text-red-600 font-medium py-2 px-4 rounded-lg">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!currentUser) {
      history.push('/login');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        restaurantId: product.storeId,
        restaurantName: product.storeName
      });
    }
    
    history.push('/cart');
  };
  
  return (
    <div className="min-h-screen bg-red-600 pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Link to="/" className="text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-white ml-2">VOLTAR</h1>
        </div>
        
        <div className="bg-gray-200 rounded-xl overflow-hidden shadow-md mb-6">
          <div className="h-56 bg-gray-300">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 bg-white">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-red-600">{product.name}</h2>
              <span className="text-xl font-bold text-yellow-500">R${product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex mb-4">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Descrição:</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <div className="flex items-center mb-4">
              <img
                src="https://via.placeholder.com/40"
                alt="Seller"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm text-gray-500">{product.storeName}</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="font-bold text-red-600">R${(product.price * quantity).toFixed(2)}</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center"
            >
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default ProductDetail;
