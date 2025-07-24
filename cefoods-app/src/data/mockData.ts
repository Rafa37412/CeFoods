export interface Product {
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

export interface Store {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  balance: number;
  hasStore: boolean;
  storeId?: string;
}

export const categories = [
  { id: 'doces', name: 'Doces', icon: '🍰' },
  { id: 'salgados', name: 'Salgados', icon: '🥐' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'outros', name: 'Outros', icon: '🍽️' },
];

export const products: Product[] = [
  {
    id: 'p1',
    storeId: '1',
    storeName: 'PH Foods',
    name: 'Brownie',
    description: 'Brownie de chocolate com recheio de creme de ninho. A combinação da descrição pode ser feita neste espaço. Esse texto está sendo usado como exemplo.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'doces',
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: 'p2',
    storeId: '1',
    storeName: 'PH Foods',
    name: 'Torta de Frango',
    description: 'Deliciosa torta de frango com massa caseira e recheio cremoso',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1613865342914-5c41d188d92f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'salgados',
    rating: 4.5,
    reviewCount: 28
  },
  {
    id: 'p3',
    storeId: '2',
    storeName: 'Doces da Ana',
    name: 'Alfajor',
    description: 'Tradicional alfajor argentino com recheio de doce de leite',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1620980776848-84ac10194945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'doces',
    rating: 4.7,
    reviewCount: 36
  },
  {
    id: 'p4',
    storeId: '2',
    storeName: 'Doces da Ana',
    name: 'Bolo de Cenoura',
    description: 'Bolo de cenoura caseiro com cobertura de chocolate',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1594178990090-31e9caae4d8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'doces',
    rating: 4.6,
    reviewCount: 32
  },
  {
    id: 'p5',
    storeId: '3',
    storeName: 'Bebidas Express',
    name: 'Coca-Cola 250ml',
    description: 'Refrigerante Coca-Cola em lata de 250ml, gelada',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'bebidas',
    rating: 4.3,
    reviewCount: 50
  },
  {
    id: 'p6',
    storeId: '3',
    storeName: 'Bebidas Express',
    name: 'Palha Italiana',
    description: 'Palha italiana caseira de chocolate com leite condensado',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1586788224331-947f68671cf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    category: 'doces',
    rating: 4.4,
    reviewCount: 25
  },
];

export const stores: Store[] = [
  {
    id: '1',
    name: 'PH Foods',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    location: 'D02',
    rating: 4.7,
  },
  {
    id: '2',
    name: 'Doces da Ana',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    location: 'C15',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Bebidas Express',
    image: 'https://images.unsplash.com/photo-1456224394380-c8e85c59a70f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
    location: 'A07',
    rating: 4.5,
  },
];

// Initial user state for localStorage
export const initialUsers: User[] = [
  {
    id: '1',
    name: 'Usuário Teste',
    email: 'teste@email.com',
    username: 'teste',
    password: 'teste123',
    balance: 100.00,
    hasStore: true,
    storeId: '1'
  }
];
