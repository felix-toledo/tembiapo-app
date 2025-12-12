import LoaderWaiter from "../src/components/ui/loaders/LoaderWaiter";

export default function Loading() {
  // Mensajes rotativos para entretener al usuario
  const messages = [
    "Conectando con profesionales...",
    "Validando identidades...",
    "Buscando en tu zona...",
    "Preparando Tembiapó..."
  ];

  return <LoaderWaiter messages={messages} />;
}