import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Clear form data when switching tabs
  useEffect(() => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      confirmPassword: '',
    });
    setError('');
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }
    
    const success = login(formData.username, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError('Usuário ou senha inválidos');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem seu bosta!');
      return;
    }
    
    const success = register({
      name: formData.name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
    });
    
    if (success) {
      navigate('/');
    } else {
      setError('Nome de usuário já existe');
    }
  };

  return (
    <div className="flex min-h-screen bg-red-600">
      <div className="w-full flex flex-col items-center justify-center px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <ShoppingCart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CEFOODS</h1>
          <p className="text-white">Bateu a fome? Peça aqui.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex w-full max-w-md bg-red-700 rounded-full mb-6 p-1">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
              activeTab === 'login' 
                ? 'bg-yellow-300 text-red-600' 
                : 'text-white hover:bg-red-800'
            }`}
          >
            ENTRAR
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-full text-center font-medium transition-colors ${
              activeTab === 'register' 
                ? 'bg-yellow-300 text-red-600' 
                : 'text-white hover:bg-red-800'
            }`}
          >
            CADASTRAR
          </button>
        </div>
        
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <div className="space-y-4 mb-4">
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="text"
                  name="username"
                  placeholder="Nome de usuário"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
            </div>
            
            {error && <p className="text-yellow-300 mb-4">{error}</p>}
            
            <button 
              type="submit"
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-red-600 font-bold py-3 px-4 rounded-full mb-4"
            >
              ENTRAR
            </button>
            
            <p className="text-center text-white">
              Ainda não possui uma conta?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-yellow-300 hover:underline"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="w-full max-w-md">
            <div className="space-y-4 mb-6">
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome Completo"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="text"
                  name="username"
                  placeholder="Login"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
              <div className="bg-yellow-300 rounded-lg p-3">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:outline-none text-red-600 placeholder-red-400"
                />
              </div>
            </div>
            
            {error && <p className="text-yellow-300 mb-4">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-red-600 font-bold py-3 px-4 rounded-full mb-4"
            >
              CADASTRAR
            </button>
            
            <p className="text-center text-white">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-yellow-300 hover:underline"
              >
                Faça login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
