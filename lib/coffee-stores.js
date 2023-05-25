import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 30,
    orientation: "portrait",
  });
  const unsplashResults = photos.response.results.map(
    (result) => result.urls.small
  );
  return unsplashResults;
};
export const fetchCoffeeStores = async () => {
  // Server side code
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores(
      "28.692653008684697%2C77.34512937964698",
      "coffee",
      6
    ),
    options
  );
  const data = await response.json();
  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      address: result.location.address || "",
      locality: result.location.locality || "",
      name: result.name,
      imgUrl: photos.length > 0 ? photos[idx] : NULL,
    };
  });
};
