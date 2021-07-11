import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonFabButton,
  IonIcon,
  IonFab,
  useIonViewWillEnter,
} from '@ionic/react';
import { camera } from 'ionicons/icons';
import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import './Profile.css';
import { Storage } from '@capacitor/storage';
import { User } from '../../models/user.model';

const Profile: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [name, setName] = useState<string>('Cargando...');
  const [email, setEmail] = useState<string>('Cargando...');

  useIonViewWillEnter(async () => {
    const { value } = await Storage.get({ key: 'LOOK_SLIDES' });
    const { value: dataUser } = await Storage.get({ key: 'DATA_USER'});
    const user: User = JSON.parse(dataUser||'');
    setName(user.firstName + '' + user.lastName);
    setEmail(user.email);
  });

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    if (cameraPhoto) {
      setPhotoUrl(cameraPhoto.dataUrl);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-text-center">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonAvatar>
                <img
                  alt="avatar"
                  src={
                    !photoUrl
                      ? 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
                      : photoUrl
                  }
                />
              </IonAvatar>
              <h1>{name}</h1>
              <h2>{email}</h2>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
