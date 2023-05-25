import { useRouter } from "next/router";
import Head from "next/head";

const DynamicRoute = () => {
  const router = useRouter();
  const query = router.query.dynamic;
  return (
    <div>
      <Head>
        <title> {query} </title>
      </Head>
      <div>hey there we are a dynamic Route: {query}</div>
    </div>
  );
};

export default DynamicRoute;
