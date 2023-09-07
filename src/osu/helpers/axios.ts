import axios, { InternalAxiosRequestConfig } from 'axios';
import { osuApiUrl, osuDirectUrl, osuOauthUrl } from '../constants/api-url';
import { app } from '../../main';
import { OsuAuthService } from '../services/osu-auth.service';

async function authInterceptor(
  request: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  const osuAuthService = (await app).get(OsuAuthService);
  const token = await osuAuthService.getToken();

  request.headers.setAuthorization(`Bearer ${token}`);

  return request;
}

export const axiosOsuApi = axios.create({
  baseURL: osuApiUrl,
});
axiosOsuApi.interceptors.request.use(authInterceptor);

export const axiosOsuOauth = axios.create({
  baseURL: osuOauthUrl,
});

export const axiosOsuDirect = axios.create({
  baseURL: osuDirectUrl,
});
