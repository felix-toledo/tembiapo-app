import { CheckCircle, MessageCircle, Users } from "lucide-react";

export function Trust() {
  const reasons = [
    {
      icon: CheckCircle,
      title: "Sin Miedo",
      description:
        "Verificamos el DNI de cada profesional para tu seguridad y tranquilidad.",
      color: "text-green-600",
    },
    {
      icon: MessageCircle,
      title: "Trato Directo",
      description:
        "Negocia directamente vía WhatsApp. Sin intermediarios, sin honorarios ocultos.",
      color: "text-[#3B5277]",
    },
    {
      icon: Users,
      title: "Talento Local",
      description:
        "Apoya el talento calificado de tu comunidad. Profesionales de confianza en el NEA.",
      color: "text-[#E35205]",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="text-center flex flex-col items-center gap-4"
              >
                <div className={`${reason.color} p-4 bg-gray-50 rounded-xl`}>
                  <Icon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
