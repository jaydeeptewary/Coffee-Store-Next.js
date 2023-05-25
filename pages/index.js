import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Banner from "../components/banner.js";
import Card from "@/components/card.js";
import { fetchCoffeeStores } from "@/lib/coffee-stores.js";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores },
  };
}

// Client side code
export default function Home(props) {
  const handleOnBannerButtonClick = () => {
    console.log("Hi Banner Button Clciked");
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
            buttonText={"View Coffee Store"}
            handleOnClick={handleOnBannerButtonClick}
          />
          <div className={styles.heroImage}>
            <Image src="/static/hero-image.png" width={700} height={400} />
          </div>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}> Local Coffee Stores </h2>
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
        </main>
      </div>
    </>
  );
}

// Static site generation with Next.js (SSG) (without External Data) && (With External Data)
// Incremental Site Re-Generation (ISR)
// Server Side Rendering (SSR)
