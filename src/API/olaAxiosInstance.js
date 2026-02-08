import axios from "axios";

// Separate axios instance for OLA Maps API calls
// OLA Maps API returns 'Access-Control-Allow-Origin: *' which doesn't work with credentials
const olaAxiosInstance = axios.create({
  withCredentials: false,
});

export default olaAxiosInstance;
