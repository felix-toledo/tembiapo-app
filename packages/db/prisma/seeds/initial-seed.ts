import { PrismaClient, VerificationStatus } from "@prisma/client";
import { hashSync } from "bcryptjs";

// Inicializamos el cliente de Prisma
const prisma = new PrismaClient();

/**
 * Hashea una contraseña. Usamos 'Sync' porque esto es un script
 * que se ejecuta una sola vez, no un servidor que necesite 'async'.
 * @param password La contraseña en texto plano.
 */
function hashPassword(password: string): string {
  // 10 "salt rounds" es un estándar seguro y performante.
  return hashSync(password, 10);
}

/**
 * Función principal del script de 'seeding'.
 */
async function main() {
  console.log("Iniciando el proceso de seeding...");

  // --- 1. Creación de Roles ---
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
    },
  });

  const professionalRole = await prisma.role.upsert({
    where: { name: "PROFESSIONAL" },
    update: {},
    create: {
      name: "PROFESSIONAL",
    },
  });

  console.log(
    `Roles creados/asegurados: ${adminRole.name}, ${professionalRole.name}`
  );

  // --- 2. Creación de Rubros (Fields) ---
  const fieldCarpintero = await prisma.field.upsert({
    where: { name: "Carpintero" },
    update: {},
    create: { name: "Carpintero" },
  });

  const fieldElectricista = await prisma.field.upsert({
    where: { name: "Electricista" },
    update: {},
    create: { name: "Electricista" },
  });

  console.log(
    `Rubros creados/asegurados: ${fieldCarpintero.name}, ${fieldElectricista.name}`
  );

  // --- 3. Creación de Áreas de Servicio ---
  const serviceAreaCorrientes = await prisma.serviceArea.upsert({
    where: {
      city_province_country: {
        city: "Corrientes",
        province: "Corrientes",
        country: "Argentina",
      },
    },
    update: { postalCode: "3400" },
    create: {
      city: "Corrientes",
      province: "Corrientes",
      country: "Argentina",
      postalCode: "3400",
    },
  });

  const serviceAreaResistencia = await prisma.serviceArea.upsert({
    where: {
      city_province_country: {
        city: "Resistencia",
        province: "Chaco",
        country: "Argentina",
      },
    },
    update: { postalCode: "3500" },
    create: {
      city: "Resistencia",
      province: "Chaco",
      country: "Argentina",
      postalCode: "3500",
    },
  });

  console.log(`Áreas de servicio creadas/aseguradas: Corrientes, Resistencia`);

  // --- 4. Creación de la Persona para el Admin ---
  const adminPerson = await prisma.person.upsert({
    where: { dni: "00000000" },
    update: {},
    create: {
      name: "Admin",
      lastName: "Tembiapo",
      dni: "00000000",
      isVerified: true,
    },
  });

  // --- 5. Creación del Usuario Admin ---
  const adminUser = await prisma.user.upsert({
    where: { mail: "felixtoledoctes@gmail.com" },
    update: {
      password: hashPassword("admin1234"),
      roleId: adminRole.id,
    },
    create: {
      username: "admin_felix",
      mail: "felixtoledoctes@gmail.com",
      password: hashPassword("admin1234"),
      roleId: adminRole.id,
      personId: adminPerson.id,
    },
  });

  console.log(`Usuario Admin creado/asegurado: ${adminUser.mail}`);

  // --- 6. Creación de la Persona para el Profesional ---
  const professionalPerson = await prisma.person.upsert({
    where: { dni: "11111111" },
    update: {},
    create: {
      name: "Juan",
      lastName: "Perez",
      dni: "11111111",
      isVerified: true,
    },
  });

  // --- 7. Creación del Usuario Profesional ---
  const professionalUser = await prisma.user.upsert({
    where: { mail: "felixtoledofac@gmail.com" },
    update: {
      password: hashPassword("profesional1234"),
      roleId: professionalRole.id,
    },
    create: {
      username: "juan_perez",
      mail: "felixtoledofac@gmail.com",
      password: hashPassword("profesional1234"),
      roleId: professionalRole.id,
      personId: professionalPerson.id,
    },
  });

  // --- 8. Creación del Perfil Profesional ---
  const professionalProfile = await prisma.professional.upsert({
    where: { userId: professionalUser.id },
    update: {},
    create: {
      userId: professionalUser.id,
      description: "Profesional con experiencia en carpintería y electricidad.",
      whatsappContact: "3794111111",
    },
  });

  // --- 9. Vinculación de Rubros al Profesional ---
  // Carpintero (Principal)
  await prisma.fieldProfessional.upsert({
    where: {
      professionalId_fieldId: {
        professionalId: professionalProfile.id,
        fieldId: fieldCarpintero.id,
      },
    },
    update: { isMain: true },
    create: {
      professionalId: professionalProfile.id,
      fieldId: fieldCarpintero.id,
      isMain: true,
    },
  });

  // Electricista
  await prisma.fieldProfessional.upsert({
    where: {
      professionalId_fieldId: {
        professionalId: professionalProfile.id,
        fieldId: fieldElectricista.id,
      },
    },
    update: { isMain: false },
    create: {
      professionalId: professionalProfile.id,
      fieldId: fieldElectricista.id,
      isMain: false,
    },
  });

  // --- 10. Vinculación de Áreas de Servicio al Profesional ---
  // Corrientes
  await prisma.areaProfessional.upsert({
    where: {
      professionalId_areaId: {
        professionalId: professionalProfile.id,
        areaId: serviceAreaCorrientes.id,
      },
    },
    update: { isMain: true },
    create: {
      professionalId: professionalProfile.id,
      areaId: serviceAreaCorrientes.id,
      isMain: true,
    },
  });

  // Resistencia
  await prisma.areaProfessional.upsert({
    where: {
      professionalId_areaId: {
        professionalId: professionalProfile.id,
        areaId: serviceAreaResistencia.id,
      },
    },
    update: { isMain: false },
    create: {
      professionalId: professionalProfile.id,
      areaId: serviceAreaResistencia.id,
      isMain: false,
    },
  });

  console.log(
    `Usuario Profesional creado/asegurado: ${professionalUser.mail} con perfil y relaciones.`
  );

  // --- 11. Creación de Portfolio Items ---
  const portfolioItem1 = await prisma.portfolioItem.upsert({
    where: { id: "portfolio-item-1-seed" },
    update: {},
    create: {
      id: "portfolio-item-1-seed",
      title: "Mueble de cocina personalizado",
      description:
        "Diseño y construcción de mueble de cocina en madera de cedro con acabado natural.",
      professionalId: professionalProfile.id,
      fieldId: fieldCarpintero.id,
    },
  });

  // Imágenes para el primer portfolio item
  await prisma.portfolioImage.upsert({
    where: { id: "portfolio-image-1-1-seed" },
    update: {},
    create: {
      id: "portfolio-image-1-1-seed",
      imageUrl: "https://picsum.photos/800/600?random=1",
      description: "Vista frontal del mueble de cocina",
      order: 0,
      portfolioItemId: portfolioItem1.id,
    },
  });

  await prisma.portfolioImage.upsert({
    where: { id: "portfolio-image-1-2-seed" },
    update: {},
    create: {
      id: "portfolio-image-1-2-seed",
      imageUrl: "https://picsum.photos/800/600?random=2",
      description: "Detalle de cajones y herrajes",
      order: 1,
      portfolioItemId: portfolioItem1.id,
    },
  });

  const portfolioItem2 = await prisma.portfolioItem.upsert({
    where: { id: "portfolio-item-2-seed" },
    update: {},
    create: {
      id: "portfolio-item-2-seed",
      title: "Instalación eléctrica residencial",
      description:
        "Instalación completa de sistema eléctrico en vivienda de 120m2, incluyendo tablero principal y sistema de iluminación LED.",
      professionalId: professionalProfile.id,
      fieldId: fieldElectricista.id,
    },
  });

  // Imágenes para el segundo portfolio item
  await prisma.portfolioImage.upsert({
    where: { id: "portfolio-image-2-1-seed" },
    update: {},
    create: {
      id: "portfolio-image-2-1-seed",
      imageUrl: "https://picsum.photos/800/600?random=3",
      description: "Tablero eléctrico instalado",
      order: 0,
      portfolioItemId: portfolioItem2.id,
    },
  });

  await prisma.portfolioImage.upsert({
    where: { id: "portfolio-image-2-2-seed" },
    update: {},
    create: {
      id: "portfolio-image-2-2-seed",
      imageUrl: "https://picsum.photos/800/600?random=4",
      description: "Sistema de iluminación LED en sala",
      order: 1,
      portfolioItemId: portfolioItem2.id,
    },
  });

  await prisma.portfolioImage.upsert({
    where: { id: "portfolio-image-2-3-seed" },
    update: {},
    create: {
      id: "portfolio-image-2-3-seed",
      imageUrl: "https://picsum.photos/800/600?random=5",
      description: "Cableado estructurado",
      order: 2,
      portfolioItemId: portfolioItem2.id,
    },
  });

  console.log(
    `Portfolio items creados: ${portfolioItem1.title}, ${portfolioItem2.title}`
  );

  console.log("Seeding completado exitosamente.");
}

// --- Ejecución del script ---
main()
  .catch((e) => {
    console.error("Error durante el seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos la conexión a la BDD al finalizar
    await prisma.$disconnect();
  });
