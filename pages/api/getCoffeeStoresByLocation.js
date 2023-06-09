import { fetchCoffeeStores } from "@/lib/coffee-stores";

const getCoffeeStoresByLocation = async (req, res) => {
  // configure latLong and limit

  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.error({ error });
    res.status(500);
    res.json({ message: "Something went wrong --> ", err });
  }
};

export default getCoffeeStoresByLocation;
