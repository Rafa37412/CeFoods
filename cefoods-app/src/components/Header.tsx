import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { cart, personCircle } from 'ionicons/icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useCart();
  const { currentUser } = useAuth();
  const history = useHistory();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (!currentUser) return null;

  const goToCart = () => {
    history.push('/cart');
  };

  const goToProfile = () => {
    history.push('/profile');
  };

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
          CEFOODS
        </IonTitle>
        <IonButtons slot="end">
          {currentUser && (
            <IonChip color="warning">
              <IonLabel><b>R${currentUser?.balance.toFixed(2)}</b></IonLabel>
            </IonChip>
          )}
          <IonButton onClick={goToCart}>
            <IonIcon icon={cart} />
            {totalItems > 0 && <IonBadge color="danger">{totalItems}</IonBadge>}
          </IonButton>
          <IonButton onClick={goToProfile}>
            <IonIcon icon={personCircle} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
