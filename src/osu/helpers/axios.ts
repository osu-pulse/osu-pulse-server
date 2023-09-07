import axios from 'axios';
import { osuApiUrl, osuDirectUrl, osuOauthUrl } from '../constants/api-url';

export const axiosOsuApi = axios.create({
  baseURL: osuApiUrl,
});

export const axiosOsuOauth = axios.create({
  baseURL: osuOauthUrl,
});

export const axiosOsuDirect = axios.create({
  baseURL: osuDirectUrl,
});
