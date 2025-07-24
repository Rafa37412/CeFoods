import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store as StoreIcon, ArrowUp, Check, DollarSign, Image, Plus, ShoppingBag, Star, TrendingUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products as allProducts } from '../data/mockData';

interface StoreData {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  sales?: number;
  revenue?: number;
  products?: number;
}

interface ProductData {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

const Store = () => {
  const { currentUser, createStore } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [userStore, setUserStore] = useState<StoreData | null>(null);
  const [storeProducts, setStoreProducts] = useState<ProductData[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    category: '',
    phone: '',
  });
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'doces',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
  });
  
  // Load user store data if they have a store
  useEffect(() => {
    if (currentUser?.hasStore && currentUser?.storeId) {
      const stores: StoreData[] = JSON.parse(localStorage.getItem('stores') || '[]');
      const store = stores.find(s => s.id === currentUser.storeId);
      if (store) {
        setUserStore(store);
        
        // Load store products
        const allProductsData = JSON.parse(localStorage.getItem('products') || JSON.stringify(allProducts));
        const storeProductsData = allProductsData.filter((p: ProductData) => p.storeId === currentUser.storeId);
        setStoreProducts(storeProductsData);
      }
    }
  }, [currentUser]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };
  
  const validateFormStep = () => {
    if (formStep === 1) {
      return formData.name.trim() !== '' && formData.location.trim() !== '';
    }
    return true;
  };
  
  const handleNextStep = () => {
    if (validateFormStep()) {
      setFormStep(prev => prev + 1);
    }
  };
  
  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormStep()) return;
    
    setIsCreating(true);
    
    // Generate a new store ID
    const newStoreId = Date.now().toString();
    
    // Create a new store object to save in localStorage
    const newStore = {
      id: newStoreId,
      name: formData.name,
      location: formData.location,
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      rating: 0,
      sales: 0,
      revenue: 0,
      products: 0
    };
    
    // Save new store to localStorage
    const existingStores = JSON.parse(localStorage.getItem('stores') || '[]');
    localStorage.setItem('stores', JSON.stringify([...existingStores, newStore]));
    
    // Update user's store status
    createStore(newStoreId);
    setIsCreating(false);
    setCreationSuccess(true);
    
    // Set the user store state
    setUserStore(newStore);
    
    // Close modal after success
    setTimeout(() => {
      setShowCreateModal(false);
      setFormStep(1);
      setCreationSuccess(false);
      setFormData({
        name: '',
        location: '',
        description: '',
        category: '',
        phone: '',
      });
    }, 2000);
  };
  
  const handleAddProduct = () => {
    if (!userStore || !currentUser) return;
    
    const price = parseFloat(productForm.price);
    if (isNaN(price) || price <= 0) {
      alert('Por favor, insira um preço válido.');
      return;
    }
    
    // Create new product
    const newProduct = {
      id: `p${Date.now()}`,
      storeId: userStore.id,
      storeName: userStore.name,
      name: productForm.name,
      description: productForm.description,
      price: price,
      image: productForm.image,
      category: productForm.category,
      rating: 0,
      reviewCount: 0
    };
    
    // Add to localStorage
    const existingProducts = JSON.parse(localStorage.getItem('products') || JSON.stringify(allProducts));
    const updatedProducts = [...existingProducts, newProduct];
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    // Update store product count
    const stores = JSON.parse(localStorage.getItem('stores') || '[]');
    const updatedStores = stores.map((s: StoreData) => 
      s.id === userStore.id ? { ...s, products: (s.products || 0) + 1 } : s
    );
    localStorage.setItem('stores', JSON.stringify(updatedStores));
    
    // Update local state
    setStoreProducts([...storeProducts, newProduct]);
    if (userStore) {
      setUserStore({
        ...userStore,
        products: (userStore.products || 0) + 1
      });
    }
    
    // Reset form and close modal
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'doces',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    });
    setShowAddProductModal(false);
  };
  
  return (
    <div className="min-h-screen bg-red-600 pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">LOJA</h1>
        <p className="text-yellow-200 mb-6">Crie sua loja e anuncie seus produtos</p>
        
        {userStore ? (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src={userStore.image}
                  alt={userStore.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-600">{userStore.name}</h2>
                <p className="text-gray-500">Localização: {userStore.location}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-red-600 mb-2">Gerenciar Produtos</h3>
              <p className="text-gray-500 mb-4">Adicione, edite e remova produtos da sua loja</p>
              <button 
                onClick={() => setShowAddProductModal(true)}
                className="bg-yellow-300 hover:bg-yellow-400 text-red-600 font-medium py-2 px-4 rounded-lg flex items-center">
                <Plus size={18} className="mr-1" /> Adicionar Produto
              </button>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeProducts.map(product => (
                  <div key={product.id} className="bg-gray-100 p-3 rounded-lg flex gap-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-red-600">{product.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-yellow-500 font-bold">R${product.price.toFixed(2)}</span>
                        <Link to={`/product/${product.id}`} className="text-xs text-gray-500 hover:text-red-600">
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {storeProducts.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <p>Nenhum produto cadastrado</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600 mb-4">Estatísticas da Loja</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-3">
                    <ShoppingBag size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Produtos</p>
                    <p className="text-xl font-bold text-red-600">{userStore.products || 0}</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-3">
                    <TrendingUp size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Vendas</p>
                    <p className="text-xl font-bold text-red-600">{userStore.sales || 0}</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-3">
                    <Star size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Avaliações</p>
                    <p className="text-xl font-bold text-red-600">{userStore.rating.toFixed(1) || 0}</p>
                  </div>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-3">
                    <DollarSign size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Faturamento</p>
                    <p className="text-xl font-bold text-red-600">R${userStore.revenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-red-600 mb-3">Histórico de Vendas</h4>
                
                {userStore.sales ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">{new Date().toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm font-medium">{Math.floor(userStore.sales * 0.4)} vendas</p>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">{new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')} - {new Date().toLocaleDateString('pt-BR')}</p>
                      <p className="text-sm font-medium">{Math.floor(userStore.sales * 0.7)} vendas</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">Total (Desde {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')})</p>
                      <p className="text-sm font-medium">{userStore.sales} vendas</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Ainda não há vendas registradas.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-red-600 mb-2">SEJA UM VENDEDOR</h2>
              <div className="w-full h-0.5 bg-red-200 mb-4"></div>
              <p className="text-gray-600 mb-6">
                Crie sua própria loja e comece a vender seus produtos para toda a comunidade escolar!
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <StoreIcon size={24} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-600 mb-1">Crie sua loja</h3>
                  <p className="text-sm text-gray-500">Cadastre-se como vendedor em minutos</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plus size={24} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-600 mb-1">Adicione produtos</h3>
                  <p className="text-sm text-gray-500">Cadastre seus produtos e preços</p>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ArrowUp size={24} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-red-600 mb-1">Comece a vender</h3>
                  <p className="text-sm text-gray-500">Receba pedidos e aumente sua renda</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-300 hover:bg-yellow-400 text-red-600 font-bold py-3 px-6 rounded-full"
              >
                CRIAR MINHA LOJA
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Store Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            {creationSuccess ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-green-600 mb-2">Loja Criada com Sucesso!</h2>
                <p className="text-gray-600 text-center">
                  Sua loja foi criada e está pronta para começar a vender.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-red-600">
                    {formStep === 1 ? 'Informações Básicas' : 'Detalhes Adicionais'}
                  </h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: formStep === 1 ? '50%' : '100%' }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span className={formStep >= 1 ? 'text-red-600 font-medium' : ''}>Informações Básicas</span>
                    <span className={formStep >= 2 ? 'text-red-600 font-medium' : ''}>Detalhes Adicionais</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {formStep === 1 && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Localização *</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Ex: Bloco A, Sala 101"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  {formStep === 2 && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Principal</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="">Selecione uma categoria</option>
                          <option value="doces">Doces</option>
                          <option value="salgados">Salgados</option>
                          <option value="bebidas">Bebidas</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone de Contato</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {formStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
                      >
                        Anterior
                      </button>
                    )}
                    
                    {formStep < 2 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!validateFormStep()}
                        className={`flex-1 py-2 rounded-lg font-medium ${
                          validateFormStep()
                            ? 'bg-yellow-300 hover:bg-yellow-400 text-red-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Próximo
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 bg-yellow-300 hover:bg-yellow-400 text-red-600 font-medium py-2 rounded-lg flex items-center justify-center"
                      >
                        {isCreating ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Criando...
                          </span>
                        ) : (
                          <>
                            <StoreIcon size={18} className="mr-2" /> Criar Loja
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Adicionar Novo Produto</h2>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAddProduct(); }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                  <input
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="doces">Doces</option>
                    <option value="salgados">Salgados</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={productForm.image}
                      onChange={handleProductChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mt-2 h-20 w-20 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={productForm.image} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-yellow-300 hover:bg-yellow-400 text-red-600 font-medium py-2 rounded-lg"
                >
                  Adicionar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
