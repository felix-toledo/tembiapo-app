"use client";

import { CheckCircle, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export function Trust() {
  const reasons = [
    {
      icon: CheckCircle,
      title: "Sin Miedo",
      description:
        "Verificamos el DNI de cada profesional para tu seguridad y tranquilidad.",
      colorClass: "text-green-600",
      bgClass: "bg-green-50 group-hover:bg-green-100",
      borderHover: "group-hover:border-green-200",
    },
    {
      icon: MessageCircle,
      title: "Trato Directo",
      description:
        "Negocia directamente vía WhatsApp. Sin intermediarios, sin honorarios ocultos.",
      colorClass: "text-[#3B5277]",
      bgClass: "bg-[#3B5277]/10 group-hover:bg-[#3B5277]/20",
      borderHover: "group-hover:border-[#3B5277]/30",
    },
    {
      icon: Users,
      title: "Talento Local",
      description:
        "Apoya el talento calificado de tu comunidad. Profesionales de confianza en el NEA.",
      colorClass: "text-[#E35205]",
      bgClass: "bg-[#E35205]/10 group-hover:bg-[#E35205]/20",
      borderHover: "group-hover:border-[#E35205]/30",
    },
  ];

  // Variantes para la animación escalonada (stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-gray-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-gray-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Confianza en cada <span className="text-[#E35205]">conexión</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500"
          >
            Creamos un entorno seguro y transparente para que contrates con total tranquilidad.
          </motion.p>
        </div>

        {/* Grid de Tarjetas */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {reasons.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }} // Efecto de levitación al pasar el mouse
                className={`
                  group relative bg-white rounded-4xl p-8 
                  border border-gray-100 shadow-sm hover:shadow-xl 
                  transition-all duration-300 ease-in-out
                  ${reason.borderHover}
                `}
              >
                <div className="flex flex-col items-center text-center">
                  {/* Círculo del Ícono con fondo dinámico */}
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center mb-6 
                    transition-colors duration-300 ${reason.bgClass}
                  `}>
                    <Icon size={40} className={reason.colorClass} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-black transition-colors">
                    {reason.title}
                  </h3>
                  
                  <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}