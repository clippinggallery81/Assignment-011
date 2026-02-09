import { useCallback } from "react";
import axiosInstance from "../lib/axiosConfig";

/**
 * Custom hook for making API calls with error handling
 */
const useApi = () => {
  const get = useCallback(async (url) => {
    try {
      const response = await axiosInstance.get(url);
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Error in GET ${url}:`, error);
      return { data: null, error: error.response?.data || error.message };
    }
  }, []);

  const post = useCallback(async (url, body) => {
    try {
      const response = await axiosInstance.post(url, body);
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Error in POST ${url}:`, error);
      return { data: null, error: error.response?.data || error.message };
    }
  }, []);

  const patch = useCallback(async (url, body) => {
    try {
      const response = await axiosInstance.patch(url, body);
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Error in PATCH ${url}:`, error);
      return { data: null, error: error.response?.data || error.message };
    }
  }, []);

  const put = useCallback(async (url, body) => {
    try {
      const response = await axiosInstance.put(url, body);
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Error in PUT ${url}:`, error);
      return { data: null, error: error.response?.data || error.message };
    }
  }, []);

  const delete_ = useCallback(async (url) => {
    try {
      const response = await axiosInstance.delete(url);
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Error in DELETE ${url}:`, error);
      return { data: null, error: error.response?.data || error.message };
    }
  }, []);

  return { get, post, patch, put, delete: delete_ };
};

export default useApi;
