import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get a random element from an array
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function AutoScroll(id: string) {
  // Buscamos el elemento y hacemos scroll suave hacia él
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return null;
}

// Función para generar una valoración "fake" basada en el ID
export function getFakeRating(id: string): number {
  const charCodeSum = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((charCodeSum % 11) + 40) / 10;
}

export const getFullImageUrl = (path: string | undefined) => {
  if (!path) return "/placeholder.png";
  
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://127.0.0.1:3001";
  
  const baseUrl = rawBaseUrl.replace('localhost', '127.0.0.1');
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}/uploads/${cleanPath}`; 
};