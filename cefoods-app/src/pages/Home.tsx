import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products as defaultProducts, categories } from '../data/mockData';
import { Star } from 'lucide-react';

const Home: React.FC = () => {
  const history = useHistory();
  const { currentUser } = useAuth();
  const [products, setProducts] = useState(defaultProducts);
  const [filteredProducts, setFilteredProducts] = useState(defaultProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [products, selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(prev => (prev === categoryId ? '' : categoryId));
  };

  const goToProduct = (id: string) => {
    history.push(`/product/${id}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid className="ion-padding">
          <IonRow>
            <IonCol>
              <IonText color="danger"><h1 className="ion-text-center">MENU PRINCIPAL</h1></IonText>
              <IonText className="ion-text-center">Itens que fazem sucesso</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            {filteredProducts.map(product => (
              <IonCol size="6" size-md="4" key={product.id}>
                <IonCard onClick={() => goToProduct(product.id)}>
                  <IonImg src={product.image} />
                  <IonCardContent>
                    <IonCardTitle>{product.name}</IonCardTitle>
                    <p>R${product.price.toFixed(2)}</p>
                    <div className="ion-margin-top">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating) ? 'ion-color-warning' : 'ion-color-medium'}
                        />
                      ))}
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonSegment value={selectedCategory} scrollable>
              {categories.map(cat => (
                <IonSegmentButton key={cat.id} value={cat.id} onClick={() => handleCategoryChange(cat.id)}>
                  <IonLabel>{cat.name}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
