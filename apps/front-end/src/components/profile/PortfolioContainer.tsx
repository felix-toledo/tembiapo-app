"use client";

import { useFetch } from '@/src/hooks/useFetch';
import { PortfolioItem } from '@/types';
import { PortfolioSection } from './PortfolioSection';

interface Props {
  username: string;
}

export const PortfolioContainer = ({ username }: Props) => {
  // Llamamos a nuestro Proxy de Next.js
  const { data, loading } = useFetch<PortfolioItem[]>(`/api/auth/portfolio/${username}`);

  // Pasamos los datos al componente visual
  // Si data es null, pasamos array vacío
  return <PortfolioSection items={data || []} isLoading={loading} />;
};