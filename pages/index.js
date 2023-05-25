import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "../components/banner.js";
import Card from "@/components/card.js";
import { fetchCoffeeStores } from "@/lib/coffee-stores.js";
import userTrackLocation from "@/hooks/user-track-location.js";
import { useEffect, useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "@/store/store-context.js";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores },
  };
}

// Client side code
export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    userTrackLocation();
  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const limit = 30;
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, limit);
          // setCoffeeStores(fetchedCoffeeStores);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores },
          });
        } catch (error) {
          console.log("Error", { error });
          setCoffeeStoresError(error.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);
  const handleOnBannerButtonClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Coffee Store</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <Banner
            buttonText={isFindingLocation ? "Locating..." : "View Coffee Store"}
            handleOnClick={handleOnBannerButtonClick}
          />
          {locationErrorMsg && (
            <p> Something went wrong : {locationErrorMsg}</p>
          )}
          {coffeeStoresError && <p> Something went wrong : {coffeeStores}</p>}
          <div className={styles.heroImage}>
            <Image src="/static/hero-image.png" width={700} height={400} />
          </div>
          <div className={styles.sectionWrapper}>
            {coffeeStores.length > 0 && (
              <>
                <h2 className={styles.heading2}> Coffee Stores Near Me !! </h2>
                <div className={styles.cardLayout}>
                  {coffeeStores.map((coffeeStores) => {
                    return (
                      <Card
                        key={coffeeStores.id}
                        name={coffeeStores.name}
                        imgURL={
                          coffeeStores.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffeeStores.id}`}
                        className={styles.card}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className={styles.sectionWrapper}>
            {props.coffeeStores.length > 0 && (
              <>
                <h2 className={styles.heading2}>
                  {" "}
                  Coffee Stores In Connaught Place{" "}
                </h2>
                <div className={styles.cardLayout}>
                  {props.coffeeStores.map((coffeeStores) => {
                    return (
                      <Card
                        key={coffeeStores.id}
                        name={coffeeStores.name}
                        imgURL={
                          coffeeStores.imgUrl ||
                          "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                        }
                        href={`/coffee-store/${coffeeStores.id}`}
                        className={styles.card}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Static site generation with Next.js (SSG) (without External Data) && (With External Data)
// Incremental Site Re-Generation (ISR)
// Server Side Rendering (SSR)
