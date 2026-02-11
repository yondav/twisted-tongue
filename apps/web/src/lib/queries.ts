import type {
  ApiResponse,
  TwisterQueryParams,
  TwisterResponse,
} from '@repo/types';
import { queryOptions } from '@tanstack/react-query';

import { API } from './api';

export const readyQuery = queryOptions({
  queryKey: ['ready'],
  queryFn: async () => {
    const { data } = await API.request<ApiResponse<null>>({
      method: 'GET',
      url: '/ready',
    });

    return data;
  },
});

export const fetchTwister = async (
  params: TwisterQueryParams,
  signal?: AbortSignal
) => {
  const { data } = await API.request<ApiResponse<TwisterResponse>>({
    method: 'GET',
    url: '/twister',
    params,
    signal,
  });
  return data;
};
