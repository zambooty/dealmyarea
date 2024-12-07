import dynamic from 'next/dynamic';

export const dynamicImport = (path: string, options = {}) =>
  dynamic(() => import(path), {
    ssr: false,
    loading: () => null,
    ...options,
  }); 