import React, { useEffect } from 'react';
import {
  IonApp,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { home, search, storefront, personCircle } from 'ionicons/icons';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Store from './pages/Store';

// ProtectedRoute: wrapper para rotas que exigem login
const ProtectedRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

// Definição das abas e rotas do app
const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <IonTabs>
      {currentUser && <Header />}
      <IonRouterOutlet>
        <Route path="/login" component={Login} exact />
        <ProtectedRoute path="/" component={Home} exact />
        <ProtectedRoute path="/product/:id" component={ProductDetail} exact />
        <ProtectedRoute path="/cart" component={Cart} exact />
        <ProtectedRoute path="/checkout" component={Checkout} exact />
        <ProtectedRoute path="/profile" component={Profile} exact />
        <ProtectedRoute path="/search" component={Search} exact />
        <ProtectedRoute path="/store" component={Store} exact />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </IonRouterOutlet>
      {currentUser && (
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="store" href="/store">
            <IonIcon icon={storefront} />
            <IonLabel>Store</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personCircle} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

// Componente principal que envolve provedores e rota Ionic
const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <IonApp>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </IonApp>
    </CartProvider>
  </AuthProvider>
);

export default App;