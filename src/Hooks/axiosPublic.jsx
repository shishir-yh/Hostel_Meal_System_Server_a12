import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "http://localhost:5000", // Base URL for your API
});

export default axiosPublic;
