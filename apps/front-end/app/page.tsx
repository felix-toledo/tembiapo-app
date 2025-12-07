import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { CategoryGrid } from '../components/landing/CategoryGrid';
import { FeaturedPros } from '../components/landing/FeaturedPros';

export default async function Home() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh-token');

  // Si el usuario está autenticado (tiene refresh-token), redirigir a /dashboard
  if (refreshToken) {
    redirect('/dashboard');
  }

  // Si no está autenticado, redirigir a /login
  redirect('/login');
}



