import axios from 'axios';
import getEnvVars from '../config';

const { apiUrl } = getEnvVars(process.env.NODE_ENV);

const api = axios.create({
  baseURL: apiUrl, // Base URL from the environment configuration
  timeout: 10000, // Timeout setting
});

export default api;