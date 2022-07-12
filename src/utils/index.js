import axios from "axios";

export const getCurrentCity = () => {
  const localCity = JSON.parse(localStorage.getItem("hkzf_city"));
  if (!localCity) {
    return new Promise((resolve, reject) => {
      AMap.plugin("AMap.CitySearch", () => {
        const citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(async (status, result) => {
          if (status === "complete" && result.info === "OK") {
            try {
              const res = await axios.get(
                `http://localhost:8080/area/info?name=${result.city}`
              );
              localStorage.setItem("hkzf_city", JSON.stringify(res.data.body));
              resolve(res.data.body);
            } catch (e) {
              reject(e);
            }
          }
        });
      });
    });
  }
  return Promise.resolve(localCity);
};
