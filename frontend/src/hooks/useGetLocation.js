export const useGetLocation = () => {
  const apiLocation = process.env.REACT_APP_LOCATION_API_KEY;

  const getLocation = async () => {
    let location;
    if (process.env.NODE_ENV === "production") {
      const request = await fetch("https://api.ipify.org/?format=json");
      const data = await request.json();
      const reqLocation = await fetch(
        `https://api.ipregistry.co/${data.ip}?key=${apiLocation}`
      );
      location = await reqLocation.json();
    }
    if (process.env.NODE_ENV === "development") {
      location = {
        ip: "127.0.0.1",
        country: {
          name: "Colombia",
          code: "CO",
        },
      };
    }
    return {
      ip: location.ip,
      country: location.country.name,
      code: location.country.code,
    };
  };
  return getLocation;
};
