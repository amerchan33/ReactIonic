import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  useIonViewWillEnter,
  IonLoading,
  useIonAlert,
  IonButton,
} from '@ionic/react';
import React, { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '50%',
};



const Maps: React.FC = () => {

  const [present] = useIonAlert();
    
  const [location, setLocation] = useState({
    lat: 28.4743207,
    lng: -81.4678193,
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCy0Wdha6agFeovPQhW0VF7vEBZqAljDXo',
  });

  const getCoordinates = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;
    setLocation({ lat, lng });
  };

  useIonViewWillEnter(() => {
    getCoordinates();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Ionic App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoaded ? (
          <GoogleMap center={location} zoom={20} mapContainerStyle={containerStyle}>
            <Marker position={{ lat: location.lat, lng: location.lng }} />
          </GoogleMap>
        ) : (
          <IonLoading isOpen={true} message={'Cargando...'} />
        )}
           <IonButton
            expand="block"
            onClick={() =>
              present({
                cssClass: 'my-css',
                header: 'Alerta',
                message: '¿Desea ubicarse en el mapa?',
                buttons: [
                  'Cancelar',
                  { text: 'SÍ', handler: (d) => {console.log('Llevar a ubicación actual'); getCoordinates(); }},
                ],
                onDidDismiss: (e) => console.log('did dismiss'),
              })
            }
          >
            Ubicación Actual
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => present(`Latitud:  ${location.lat}
                                    Longitud  ${location.lng}, 
                                    `, 
                                    [{ text: 'Ok' }])}
          >
            ¿Dónde estoy?
          </IonButton>
      </IonContent>
       
    </IonPage>
  );


};

export default Maps;
