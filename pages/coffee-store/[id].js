import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "@/lib/coffee-stores.js";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "@/store/store-context.js";
import { isEmpty } from "@/utils";

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const pathName = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths: pathName,
    fallback: true,
  };
}

export async function getStaticProps(staticProps) {
  // we can destructure the same above also like {params}
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });
  return {
    props: {
      coffeeStore: coffeeStoreFromContext ? coffeeStoreFromContext : {},
    },
  };
}

const CoffeStore = (initialProps) => {
  const router = useRouter();
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  //Data we are getting from ContextAPI
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, address, locality } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          address: address || "",
          locality: locality || "",
        }),
      });

      const dbCoffeeStore = response.json();
      console.log({ dbCoffeeStore });
    } catch (err) {
      console.error("Error creating coffee store");
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG --> static site generation
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);
  if (router.isFallback) {
    return <div> ... loading ... </div>;
  }
  const { address, locality, name, imgUrl } = coffeeStore;

  const [votingCount, setVotingCount] = useState(1);

  const handleUpvoteButton = () => {
    console.log("Up Vote Button");
    let count = votingCount + 1;
    setVotingCount(count);
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link legacyBehavior href="/">
              <a> ← Back to home </a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" height="24" width="24" />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {locality && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" height="24" width="24" />
              <p className={styles.text}>{locality}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" height="24" width="24" />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            UpVote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeStore;
