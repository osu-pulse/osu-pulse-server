import axios from 'axios';
import { osuUrl } from '../constants/osu-url';

export const axiosOsuApi = axios.create({
  baseURL: osuUrl.api,
});

export const axiosOsuOauth = axios.create({
  baseURL: osuUrl.oauth,
});

export const axiosOsuDirect = axios.create({
  baseURL: osuUrl.direct,
});
