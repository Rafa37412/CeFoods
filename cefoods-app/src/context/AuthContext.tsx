import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { initialUsers, User } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  register: (user: Omit<User, 'id' | 'balance' | 'hasStore'>) => boolean;
  logout: () => void;
  updateBalance: (amount: number) => void;
  updateUser: (userData: Partial<User>) => void;
  createStore: (storeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Initialize localStorage with default users and stores if empty
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
    
    // Initialize stores if empty
    const storedStores = localStorage.getItem('stores');
    if (!storedStores) {
      localStorage.setItem('stores', JSON.stringify([]));
    }
    
    // Check for logged in user
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }
  }, []);

  const getUsers = (): User[] => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (username: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id' | 'balance' | 'hasStore'>): boolean => {
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if username already exists
    if (users.find((u: User) => u.username === userData.username)) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      balance: 0,
      hasStore: false
    };
    
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateBalance = (amount: number) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + amount
    };
    
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    
    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const updateUser = (userData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const updatedUsers = users.map((u: User) => 
      u.id === currentUser.id ? updatedUser : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const createStore = (storeId: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      hasStore: true,
      storeId
    };
    
    // Get the latest users from localStorage
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const updatedUsers = users.map((u: User) => 
      u.id === currentUser.id ? updatedUser : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      updateBalance,
      updateUser,
      createStore
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
