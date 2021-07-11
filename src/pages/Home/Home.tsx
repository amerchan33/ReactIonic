import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  IonAlert,
  useIonAlert
} from "@ionic/react";
import { useContext, useState } from "react";
import ApplicationContext from "../../context/ApplicationContext";
import { Character } from "../../models/character.model";
import { InfoPagination } from "../../models/infoPagination.model";
import "./Home.css";

const Home: React.FC = () => {
  const applicationContext = useContext(ApplicationContext);

  const [next, setNext] = useState("");
  const [prev, setPrev] = useState("");

  useIonViewDidEnter(() => {
    setTimeout(async () => {
      await loadData('https://rickandmortyapi.com/api/character');
    }, 3000);
  });

  const loadData = async (url: string) => {
    const result = await fetch(url);
    const data = await result.json();
    const infoPag: InfoPagination = data.info;
    const resultCharacters: Character[] = data.results;

    setNext(infoPag.next ? infoPag.next : "");
    setPrev(infoPag.prev ? infoPag.prev : "");
    /**ACTUALIZANDO EL ESTADO */
    applicationContext.refreshCharacters(resultCharacters);
  };

  const deleteData = (item: Character)=>{
    return applicationContext.characters.filter(character=>{
       return character.id !== item.id
    })
  }

  const onClickNext = async () => {
    applicationContext.refreshCharacters([]);
    await loadData(next);
  };

  const onClickPrev = async () => {
    applicationContext.refreshCharacters([]);
    await loadData(prev);
  };

  const [present] = useIonAlert();

  const onDeleteCard = (item: Character) => {
    // applicationContext.characters =  deleteData(item);
    applicationContext.refreshCharacters( deleteData(item));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Inicio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {applicationContext.characters.length === 0 ? (
          <IonGrid>
            <IonRow>
              <IonCol className="ion-text-center">
                <IonCard>
                  <IonSkeletonText
                    animated
                    style={{ width: "100%", height: "300px" }}
                  />
                  <IonCardHeader>
                    <IonCardSubtitle>
                      <IonSkeletonText animated style={{ width: "100%" }} />
                    </IonCardSubtitle>
                    <IonCardTitle>
                      <IonSkeletonText animated style={{ width: "100%" }} />
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: "100%" }} />
                  </IonCardContent>
                </IonCard>
                <IonCard>
                  <IonSkeletonText
                    animated
                    style={{ width: "100%", height: "300px" }}
                  />
                  <IonCardHeader>
                    <IonCardSubtitle>
                      <IonSkeletonText animated style={{ width: "100%" }} />
                    </IonCardSubtitle>
                    <IonCardTitle>
                      <IonSkeletonText animated style={{ width: "100%" }} />
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: "100%" }} />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <>
            <IonGrid>
              {applicationContext.characters.map((item) => (
                <IonRow key={item.id}>
                  <IonCol className="ion-text-center">
                    <IonCard>
                      <img src={item.image} alt="content-rym" />
                      <IonCardHeader>
                        <IonCardSubtitle>{item.species}</IonCardSubtitle>
                        <IonCardTitle>{item.name}</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <p>{item.status}</p>
                      </IonCardContent>
                      <IonButton
            expand="block"
            onClick={() =>
              present({
                cssClass: 'my-css',
                header: 'Alerta',
                message: `Desea eliminar al personaje:  ${item.name}`,
                buttons: [ 
                  'Cancelar',
                  { text: 'SÍ', handler: (d) => { onDeleteCard(item); }},
                ],
                onDidDismiss: (e) => console.log('refrescar datos',applicationContext.characters.length),
              })
            }
          >
            Eliminar Personaje
          </IonButton>
                    </IonCard>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </>
        )}
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol size="3" className="ion-align-self-center">
              <IonButton
                disabled={prev === ""}
                onClick={onClickPrev}
                size="small"
              >
                Anterior
              </IonButton>
            </IonCol>
            <IonCol size="3" className="ion-align-self-center">
              <IonButton
                disabled={next === ""}
                onClick={onClickNext}
                size="small"
              >
                Siguiente
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
