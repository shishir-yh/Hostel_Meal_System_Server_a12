import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosPublic from "./axiosPublic"; // Import your axios instance
// Custom Axios Hook
const useApi = () => {
    const queryClient = useQueryClient();

    // Get data with refetching
    const fetchData = async (url) => {
        const response = await axiosPublic.get(url); // Use axiosPublic for GET requests
        return response.data;
    };

    // Post data with mutation
    const postData = async ({ url, data }) => {
        const response = await axiosPublic.post(url, data); // Use axiosPublic for POST requests
        return response.data;
    };

    return {
        fetchData,
        postData,
        queryClient,
        useQuery,
        useMutation,
    };
};

export default useApi;
