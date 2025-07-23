import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowDown, ArrowUp, Pencil, LogOut, Save } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUser, updateBalance, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    username: currentUser?.username || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };
  
  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      updateBalance(depositAmount);
      setAmount('');
      setShowDepositModal(false);
    }
  };
  
  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0 && currentUser && withdrawAmount <= currentUser.balance) {
      updateBalance(-withdrawAmount);
      setAmount('');
      setShowWithdrawModal(false);
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="min-h-screen bg-red-600 pb-16">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-red-600">Meu Perfil</h1>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Pencil size={20} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="text-green-600 hover:text-green-700"
              >
                <Save size={20} />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                <p>{currentUser.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome de Usuário</h3>
                <p>{currentUser.username}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Saldo da Conta</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-gray-500 mb-1">Saldo Atual</p>
              <p className="text-3xl font-bold text-red-600">R${currentUser.balance.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowDepositModal(true)} 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <ArrowDown size={18} className="mr-1" /> Depositar
            </button>
            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
              disabled={currentUser.balance <= 0}
            >
              <ArrowUp size={18} className="mr-1" /> Sacar
            </button>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full bg-yellow-300 hover:bg-yellow-400 text-red-600 font-bold py-3 rounded-full flex items-center justify-center"
        >
          <LogOut size={18} className="mr-2" /> Sair
        </button>
      </div>
      
      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Depositar</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowDepositModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeposit}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Sacar</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                max={currentUser.balance}
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleWithdraw}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
