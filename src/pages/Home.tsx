import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';

// Defina uma interface para o tipo de produto
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: StyleS  // Adicionando campos opcionais para evitar erros
  category?: string;
  rating?: number;
}

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // A URL da nossa API backend
        const response = await fetch('http://localhost:3001/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  if (loading) return <div className="p-4">Carregando produtos...</div>;
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-red-600 pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">MENU PRINCIPAL</h1>
          <p className="text-yellow-200">Itens que fazem sucesso</p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-red-600">{product.name}</h3>
                <p className="text-yellow-500 font-bold">R${product.price.toFixed(2)}</p>
                <div className="mt-1 flex">
                  <div className="flex text-yellow-400">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating || 0) ? "fill-yellow-400" : "fill-gray-200"}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Categorias de Produtos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id === activeCategory ? 'all' : category.id)}
                className={`flex items-center justify-center py-4 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-yellow-300 text-red-600' 
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
