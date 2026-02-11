import axios, { type AxiosInstance } from 'axios';

import { API_URL } from './consts';

export const API: AxiosInstance = axios.create({
  baseURL: API_URL,
});

API.defaults.headers.common['Content-Type'] = 'application/json';
