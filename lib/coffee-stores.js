import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    page: 1,
    perPage: 40,
    orientation: "portrait",
  });
  const unsplashResults = photos.response.results.map(
    (result) => result.urls.small
  );
  return unsplashResults;
};
export const fetchCoffeeStores = async (
  latLong = "28.632630733192904,77.21923509530585",
  limit = 6
) => {
  // Server side code
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee", limit),
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
