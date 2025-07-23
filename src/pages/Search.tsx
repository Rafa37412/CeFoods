import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, Star, Store } from 'lucide-react';
import { products as defaultProducts, stores as defaultStores } from '../data/mockData';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(defaultProducts);
  const [stores, setStores] = useState(defaultStores);
  const [searchResults, setSearchResults] = useState<{
    products: typeof defaultProducts,
    stores: typeof defaultStores
  }>({ products: [], stores: [] });
  
  useEffect(() => {
    // Load products and stores from localStorage if available
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    const storedStores = localStorage.getItem('stores');
    if (storedStores) {
      setStores(JSON.parse(storedStores));
    } else {
      localStorage.setItem('stores', JSON.stringify(defaultStores));
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], stores: [] });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    // Search for products
    const matchedProducts = products.filter(
      product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
    
    // Search for stores
    const matchedStores = stores.filter(
      store => 
        store.name.toLowerCase().includes(query) ||
        store.location.toLowerCase().includes(query)
    );
    
    setSearchResults({
      products: matchedProducts,
      stores: matchedStores
    });
  };
  
  return (
    <div className="min-h-screen bg-red-600 pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">BUSCAR</h1>
        <p className="text-yellow-200 mb-4">Busque por itens, lojas ou usuários</p>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua busca..."
              className="w-full py-3 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-3 text-gray-400"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </form>
        
        {(searchResults.stores.length > 0 || searchResults.products.length > 0) && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-red-600 mb-4 border-b border-red-200 pb-2">Resultados da pesquisa</h3>
            
            {searchResults.stores.length > 0 && (
              <div className="mb-6">
                {searchResults.stores.map(store => (
                  <div key={store.id} className="bg-gray-100 rounded-lg p-4 mb-3 flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden mr-3">
                      <img 
                        src={store.image} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-red-600">{store.name}</h4>
                        <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">Loja</span>
                      </div>
                      <p className="text-sm text-gray-500">Localização: {store.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {searchResults.products.length > 0 && (
              <div>
                {searchResults.products.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id}>
                    <div className="bg-gray-100 rounded-lg p-3 mb-3 flex">
                      <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden mr-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-red-600">{product.name}</h4>
                            <p className="text-xs text-gray-500">Produto</p>
                          </div>
                          <span className="font-bold text-yellow-500">R${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 mr-1">
                            {Array(5).fill(0).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < Math.floor(product.rating) ? "fill-yellow-400" : "fill-gray-200"}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">• {product.storeName}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
