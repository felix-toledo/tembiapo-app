// Utility function to get a random element from an array
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function AutoScroll(id: string) {
    // Buscamos el elemento y hacemos scroll suave hacia él
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  return null;
}

// Función para generar una valoración "fake" basada en el ID
export function getFakeRating(id: string): number {
  const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((charCodeSum % 11) + 40) / 10;
}
