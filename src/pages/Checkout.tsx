import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { currentUser, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [ratings, setRatings] = useState<{[key: string]: {rating: number, comment: string}}>({});
  const [activePaymentMethod, setActivePaymentMethod] = useState<'balance' | 'cash' | 'pix'>('balance');

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  const total = getTotalPrice();
  const canPurchase = currentUser.balance >= total;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    const paymentMethod = activePaymentMethod;
    
    if (paymentMethod === 'balance' && !canPurchase) {
      setFormError('Saldo insuficiente para completar a compra');
      return;
    }
    
    setIsSubmitting(true);
    
    // If paying with balance, deduct from account
    if (paymentMethod === 'balance') {
      updateBalance(-total);
    }
    
    // Update store sales and revenue if applicable
    updateStoreSales();
    
    // Initialize ratings object with empty ratings for each item
    const initialRatings: {[key: string]: {rating: number, comment: string}} = {};
    cartItems.forEach(item => {
      initialRatings[item.id] = { rating: 0, comment: '' };
    });
    setRatings(initialRatings);
    
    // Complete order
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentProductIndex(0);
      setShowRatingModal(true);
    }, 1000);
  };
  
  // Function to update store sales and revenue
  const updateStoreSales = () => {
    // Group items by store
    const storeItems: {[key: string]: {count: number, revenue: number}} = {};
    
    cartItems.forEach(item => {
      if (!storeItems[item.restaurantId]) {
        storeItems[item.restaurantId] = { count: 0, revenue: 0 };
      }
      storeItems[item.restaurantId].count += item.quantity;
      storeItems[item.restaurantId].revenue += item.price * item.quantity;
    });
    
    // Update each store's stats
    const stores = JSON.parse(localStorage.getItem('stores') || '[]');
    const updatedStores = stores.map((store: any) => {
      if (storeItems[store.id]) {
        return {
          ...store,
          sales: (store.sales || 0) + storeItems[store.id].count,
          revenue: (store.revenue || 0) + storeItems[store.id].revenue
        };
      }
      return store;
    });
    
    localStorage.setItem('stores', JSON.stringify(updatedStores));
  };
  
  const handleRatingChange = (productId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], rating }
    }));
  };
  
  const handleCommentChange = (productId: string, comment: string) => {
    setRatings(prev => ({
      ...prev,
      [productId]: { ...prev[productId], comment }
    }));
  };
  
  const handleNextProduct = () => {
    if (currentProductIndex < cartItems.length - 1) {
      setCurrentProductIndex(prev => prev + 1);
    } else {
      // Finished rating all products
      clearCart(); // Clear cart after purchase and ratings
      navigate('/');
    }
  };
  
  const handlePrevProduct = () => {
    if (currentProductIndex > 0) {
      setCurrentProductIndex(prev => prev - 1);
    }
  };
  
  const handleSkipRatings = () => {
    clearCart();
    navigate('/');
  };
  
  const currentProduct = cartItems[currentProductIndex];
  const isLastProduct = currentProductIndex === cartItems.length - 1;

  return (
    <div className="min-h-screen bg-red-600 pb-20">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Finalizar Compra</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="font-semibold text-lg text-red-600 mb-4">Resumo do Pedido</h2>
          
          <div className="max-h-64 overflow-y-auto mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3 mb-3 pb-3 border-b last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-12 h-12">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="text-sm">R${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.restaurantName}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between font-semibold">
            <span>Total</span>
            <span>R${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="font-semibold text-lg text-red-600 mb-4">Método de Pagamento</h2>
          
          {/* Payment Method Tabs */}
          <div className="flex w-full bg-gray-100 rounded-full mb-6 p-1">
            <button 
              onClick={() => setActivePaymentMethod('balance')}
              className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
                activePaymentMethod === 'balance' 
                  ? 'bg-yellow-300 text-red-600' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              SALDO
            </button>
            <button 
              onClick={() => setActivePaymentMethod('pix')}
              className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
                activePaymentMethod === 'pix' 
                  ? 'bg-yellow-300 text-red-600' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              PIX
            </button>
            <button 
              onClick={() => setActivePaymentMethod('cash')}
              className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
                activePaymentMethod === 'cash' 
                  ? 'bg-yellow-300 text-red-600' 
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              DINHEIRO
            </button>
          </div>
          
          {/* Balance Payment */}
          {activePaymentMethod === 'balance' && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Saldo da Conta</p>
                  <p className="text-sm text-gray-500">Usar saldo disponível para pagamento</p>
                </div>
                <span className="font-bold text-red-600">R${currentUser.balance.toFixed(2)}</span>
              </div>
              
              {!canPurchase && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  Saldo insuficiente. Adicione mais fundos à sua conta para continuar.
                </div>
              )}
            </div>
          )}
          
          {/* PIX Payment */}
          {activePaymentMethod === 'pix' && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="font-medium mb-2">Pagamento via PIX</p>
                <p className="text-sm text-gray-500 mb-4">Realize o pagamento na entrega com PIX</p>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-center font-medium mb-2">Chave PIX</p>
                  <p className="text-center text-gray-600 mb-3">012.345.678-90</p>
                  <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      QR Code
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Cash Payment */}
          {activePaymentMethod === 'cash' && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <div>
                <p className="font-medium">Pagamento em Dinheiro</p>
                <p className="text-sm text-gray-500">Realize o pagamento na entrega com dinheiro</p>
                
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Valor a ser pago:</p>
                  <p className="font-bold text-red-600">R${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {formError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg mb-6">
            {formError}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (activePaymentMethod === 'balance' && !canPurchase)}
          className={`w-full font-bold py-3 px-6 rounded-full flex items-center justify-center mb-4 
            ${(activePaymentMethod !== 'balance' || canPurchase)
              ? 'bg-yellow-300 hover:bg-yellow-400 text-red-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            'FINALIZAR COMPRA'
          )}
        </button>
        
        <Link to="/cart" className="block text-center text-white hover:underline">
          Voltar ao carrinho
        </Link>
      </div>
      
      {/* Multi-Product Rating Modal */}
      {showRatingModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">AVALIAR PRODUTO {currentProductIndex + 1}/{cartItems.length}</h2>
              <button onClick={handleSkipRatings}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center mb-4 gap-3">
              <div className="flex-shrink-0 w-16 h-16">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name} 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="font-semibold">{currentProduct.name}</h3>
                <p className="text-sm text-gray-500">{currentProduct.restaurantName}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingChange(currentProduct.id, star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={40}
                    className={star <= (ratings[currentProduct.id]?.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">COMENTÁRIO</h3>
              <textarea
                value={ratings[currentProduct.id]?.comment || ''}
                onChange={(e) => handleCommentChange(currentProduct.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2">
              {currentProductIndex > 0 && (
                <button
                  onClick={handlePrevProduct}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-full flex items-center justify-center"
                >
                  <ChevronLeft size={20} className="mr-1" /> ANTERIOR
                </button>
              )}
              
              <button
                onClick={handleNextProduct}
                className="flex-1 bg-yellow-300 hover:bg-yellow-400 text-red-600 font-bold py-3 rounded-full flex items-center justify-center"
              >
                {isLastProduct ? 'CONCLUIR' : 'PRÓXIMO'} {!isLastProduct && <ChevronRight size={20} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
