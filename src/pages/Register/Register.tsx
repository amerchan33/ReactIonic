import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonToast,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { chevronBackSharp } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { User } from "../../models/user.model";
import { SignUp } from "../../services/AuthenticationService";

import "./Register.css";
const Register: React.FC = () => {
  const history = useHistory();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [present, dismiss] = useIonToast();

  const refFirstName = useRef<HTMLIonInputElement>(null);
  const refLastName = useRef<HTMLIonInputElement>(null);
  const refEmail = useRef<HTMLIonInputElement>(null);
  const refPassword = useRef<HTMLIonInputElement>(null);

  const handleClickSignUp = async () => {
    const firstName = refFirstName.current?.value as string;
    const lastName = refLastName.current?.value as string;
    const email = refEmail.current?.value as string;
    const password = refPassword.current?.value as string;

    let mensaje = "";
    if (firstName.length < 6) {
      mensaje = "Nombre debe ser mayor a 6 caracteres";
    }

    if (lastName.length < 6) {
      mensaje += `\nApellidos deben ser mayor a 6 caracteres`;
    }

    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      mensaje += "\nEmail inválido";
    }

    if (password.length <= 6) {
      mensaje += `\nClave debe ser mayor a 6 caracteres`;
    }

    if (mensaje !== "") {
      present(mensaje, 3000);
    }

    if (firstName && lastName && email && password) {
      const userToRegister: User = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      };

      const resultSignUp = await SignUp(userToRegister);
      if (resultSignUp.userExists) {
        setMessage(resultSignUp.message);
      } else {
        if (resultSignUp.data) {
          setShowAlert(true);
        }
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton routerLink="/login" routerDirection="back">
              <IonIcon icon={chevronBackSharp} />
              Regresar
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <br />
        <figure>
          <img
            src="https://ionicframework.com/blog/wp-content/uploads/2019/02/ionic-vs-react-native.png"
            alt="logo-app"
          />
        </figure>
        <IonItem lines="none" className="ion-item-register">
          <IonInput type="text" placeholder="Nombres" ref={refFirstName} />
        </IonItem>
        <IonItem lines="none" className="ion-item-register">
          <IonInput type="text" placeholder="Apellidos" ref={refLastName} />
        </IonItem>
        <IonItem lines="none" className="ion-item-register">
          <IonInput
            type="email"
            placeholder="Correo Electronico"
            ref={refEmail}
          />
        </IonItem>
        <IonItem lines="none" className="ion-item-register">
          <IonInput
            type="password"
            placeholder="Contraseña"
            ref={refPassword}
          />
        </IonItem>
        <IonAlert
          isOpen={showAlert}
          header="Felicidades"
          message="La cuenta se registro correctamente."
          buttons={[
            {
              text: "OK",
              handler: () => {
                history.push("/login");
              },
            },
          ]}
        />
        <IonToast
          isOpen={message !== undefined}
          onDidDismiss={() => setMessage(undefined)}
          message={message}
          duration={3000}
        />
      </IonContent>
      <IonFooter className="ion-padding">
        <IonButton
          size="large"
          expand="block"
          fill="solid"
          onClick={handleClickSignUp}
        >
          Registrar
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default Register;
