import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())


const useHttpGet = <T = any>(url?: string) =>
{
  return useSWR<T>(url, fetcher);
}

export { useHttpGet }
