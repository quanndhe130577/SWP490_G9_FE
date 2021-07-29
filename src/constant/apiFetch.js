// Api for component searchFetchApi
const API_FETCH = {
  FIND_BUYER: {
    url: "getBuyerByNameOrPhone",
    body: {},
    method: "GET",
    pram: "phone",
  },
  FIND_TRADER: {
    url: "suggestTDByPhone",
    body: {},
    method: "GET",
    pram: "phone",
  },
};
export default API_FETCH;
