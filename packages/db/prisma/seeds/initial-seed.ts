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
  const fields = [
    "Carpintero",
    "Electricista",
    "Albañil",
    "Plomero",
    "Gasista",
  ];

  const fieldMap = new Map();

  for (const fieldName of fields) {
    const field = await prisma.field.upsert({
      where: { name: fieldName },
      update: {},
      create: { name: fieldName },
    });
    fieldMap.set(fieldName, field);
  }

  console.log(`Rubros creados/asegurados: ${fields.join(", ")}`);

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

  // --- 4. Creación del Admin ---
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

  const adminUser = await prisma.user.upsert({
    where: { mail: "felixtoledofac@gmail.com" },
    update: {
      password: hashPassword("admin1234"),
      roleId: adminRole.id,
    },
    create: {
      username: "admin_felix",
      mail: "felixtoledofac@gmail.com",
      password: hashPassword("admin1234"),
      roleId: adminRole.id,
      personId: adminPerson.id,
    },
  });

  console.log(`Usuario Admin creado/asegurado: ${adminUser.mail}`);

  // --- 5. Creación de Profesionales ---

  const professionalsData = [
    {
      // 1. Juan Perez (Verificado) - Carpintero & Electricista
      name: "Juan",
      lastName: "Perez",
      dni: "11111111",
      isVerified: true,
      email: "juan.perez@example.com",
      username: "juan_perez",
      description:
        "Especialista en muebles a medida y reparaciones eléctricas.",
      fields: [
        { name: "Carpintero", isMain: true },
        { name: "Electricista", isMain: false },
      ],
      areas: [{ area: serviceAreaCorrientes, isMain: true }],
      portfolio: [
        {
          title: "Mueble de cocina",
          description: "Cocina integral en melamina blanca.",
          images: [
            {
              url: "https://picsum.photos/seed/juan1/800/600",
              desc: "Vista general",
            },
            {
              url: "https://picsum.photos/seed/juan2/800/600",
              desc: "Detalle de alacena",
            },
          ],
        },
        {
          title: "Instalación de luminarias",
          description: "Colocación de luces LED en departamento.",
          images: [
            {
              url: "https://picsum.photos/seed/juan3/800/600",
              desc: "Sala de estar",
            },
            {
              url: "https://picsum.photos/seed/juan4/800/600",
              desc: "Cocina iluminada",
            },
          ],
        },
      ],
    },
    {
      // 2. Maria Gonzalez (Verificado) - Albañil
      name: "Maria",
      lastName: "Gonzalez",
      dni: "22222222",
      isVerified: true,
      email: "maria.gonzalez@example.com",
      username: "maria_gonzalez",
      description: "Construcción en general, reformas y ampliaciones.",
      fields: [{ name: "Albañil", isMain: true }],
      areas: [{ area: serviceAreaResistencia, isMain: true }],
      portfolio: [
        {
          title: "Quincho con parrilla",
          description: "Construcción desde cero de quincho familiar.",
          images: [
            {
              url: "https://picsum.photos/seed/maria1/800/600",
              desc: "Estructura terminada",
            },
            {
              url: "https://picsum.photos/seed/maria2/800/600",
              desc: "Parrilla en detalle",
            },
          ],
        },
        {
          title: "Revoque exterior",
          description: "Revoque fino en fachada de vivienda.",
          images: [
            {
              url: "https://picsum.photos/seed/maria3/800/600",
              desc: "Frente de la casa",
            },
            {
              url: "https://picsum.photos/seed/maria4/800/600",
              desc: "Terminación de muro",
            },
          ],
        },
      ],
    },
    {
      // 3. Carlos Lopez (No Verificado) - Plomero
      name: "Carlos",
      lastName: "Lopez",
      dni: "33333333",
      isVerified: false,
      email: "carlos.lopez@example.com",
      username: "carlos_lopez",
      description: "Soluciones rápidas para problemas de plomería.",
      fields: [{ name: "Plomero", isMain: true }],
      areas: [{ area: serviceAreaCorrientes, isMain: true }],
      portfolio: [
        {
          title: "Reparación de filtración",
          description: "Arreglo de caño roto en baño.",
          images: [
            {
              url: "https://picsum.photos/seed/carlos1/800/600",
              desc: "Caño dañado",
            },
            {
              url: "https://picsum.photos/seed/carlos2/800/600",
              desc: "Reparación finalizada",
            },
          ],
        },
        {
          title: "Instalación de grifería",
          description: "Cambio de grifería en cocina y baño.",
          images: [
            {
              url: "https://picsum.photos/seed/carlos3/800/600",
              desc: "Grifería de cocina nueva",
            },
            {
              url: "https://picsum.photos/seed/carlos4/800/600",
              desc: "Grifería de baño instalada",
            },
          ],
        },
      ],
    },
    {
      // 4. Ana Martinez (No Verificado) - Gasista
      name: "Ana",
      lastName: "Martinez",
      dni: "44444444",
      isVerified: false,
      email: "ana.martinez@example.com",
      username: "ana_martinez",
      description: "Gasista matriculada, instalaciones y revisiones.",
      fields: [{ name: "Gasista", isMain: true }],
      areas: [{ area: serviceAreaResistencia, isMain: true }],
      portfolio: [
        {
          title: "Instalación de calefón",
          description: "Colocación y prueba de calefón a gas.",
          images: [
            {
              url: "https://picsum.photos/seed/ana1/800/600",
              desc: "Calefón instalado",
            },
            {
              url: "https://picsum.photos/seed/ana2/800/600",
              desc: "Conexión de gas",
            },
          ],
        },
        {
          title: "Inspección de fugas",
          description: "Revisión integral de instalación de gas.",
          images: [
            {
              url: "https://picsum.photos/seed/ana3/800/600",
              desc: "Manómetro de prueba",
            },
            {
              url: "https://picsum.photos/seed/ana4/800/600",
              desc: "Cañerías revisadas",
            },
          ],
        },
      ],
    },
    {
      // 5. Pedro Sanchez (No Verificado) - Carpintero
      name: "Pedro",
      lastName: "Sanchez",
      dni: "55555555",
      isVerified: false,
      email: "pedro.sanchez@example.com",
      username: "pedro_sanchez",
      description: "Restauración de muebles y trabajos en madera.",
      fields: [{ name: "Carpintero", isMain: true }],
      areas: [
        { area: serviceAreaCorrientes, isMain: true },
        { area: serviceAreaResistencia, isMain: false },
      ],
      portfolio: [
        {
          title: "Restauración de silla antigua",
          description: "Lijado, encolado y barnizado de silla de roble.",
          images: [
            {
              url: "https://picsum.photos/seed/pedro1/800/600",
              desc: "Estado original",
            },
            {
              url: "https://picsum.photos/seed/pedro2/800/600",
              desc: "Silla restaurada",
            },
          ],
        },
        {
          title: "Estantería flotante",
          description: "Instalación de estantes de madera para libros.",
          images: [
            {
              url: "https://picsum.photos/seed/pedro3/800/600",
              desc: "Estante colocado",
            },
            {
              url: "https://picsum.photos/seed/pedro4/800/600",
              desc: "Libros en estante",
            },
          ],
        },
      ],
    },
  ];

  for (const p of professionalsData) {
    // 1. Crear Persona
    const person = await prisma.person.upsert({
      where: { dni: p.dni },
      update: {},
      create: {
        name: p.name,
        lastName: p.lastName,
        dni: p.dni,
        isVerified: p.isVerified,
      },
    });

    // 2. Crear Usuario
    const user = await prisma.user.upsert({
      where: { mail: p.email },
      update: {
        password: hashPassword("profesional1234"),
        roleId: professionalRole.id,
      },
      create: {
        username: p.username,
        mail: p.email,
        password: hashPassword("profesional1234"),
        roleId: professionalRole.id,
        personId: person.id,
      },
    });

    // 3. Crear Perfil Profesional
    const professionalProfile = await prisma.professional.upsert({
      where: { userId: user.id },
      update: {
        description: p.description,
      },
      create: {
        userId: user.id,
        description: p.description,
        whatsappContact: "3794000000", // Default para todos por ahora
      },
    });

    // 4. Vincular Rubros
    for (const f of p.fields) {
      const fieldEntity = fieldMap.get(f.name);
      if (fieldEntity) {
        await prisma.fieldProfessional.upsert({
          where: {
            professionalId_fieldId: {
              professionalId: professionalProfile.id,
              fieldId: fieldEntity.id,
            },
          },
          update: { isMain: f.isMain },
          create: {
            professionalId: professionalProfile.id,
            fieldId: fieldEntity.id,
            isMain: f.isMain,
          },
        });
      }
    }

    // 5. Vincular Áreas
    for (const a of p.areas) {
      await prisma.areaProfessional.upsert({
        where: {
          professionalId_areaId: {
            professionalId: professionalProfile.id,
            areaId: a.area.id,
          },
        },
        update: { isMain: a.isMain },
        create: {
          professionalId: professionalProfile.id,
          areaId: a.area.id,
          isMain: a.isMain,
        },
      });
    }

    // 6. Crear Portfolio Items
    let itemIndex = 1;
    for (const item of p.portfolio) {
      // Usamos un ID determinístico para que los upserts funcionen bien si se corre de nuevo
      const itemId = `portfolio-${p.username}-${itemIndex}`;

      // Asignamos el primer rubro del profesional por defecto si no es específico
      const fieldEntity = fieldMap.get(p.fields[0].name);

      const portfolioItem = await prisma.portfolioItem.upsert({
        where: { id: itemId },
        update: {},
        create: {
          id: itemId,
          title: item.title,
          description: item.description,
          professionalId: professionalProfile.id,
          fieldId: fieldEntity.id,
        },
      });

      // 7. Crear Imágenes del Portfolio
      let imgIndex = 1;
      for (const img of item.images) {
        const imgId = `${itemId}-img-${imgIndex}`;
        await prisma.portfolioImage.upsert({
          where: { id: imgId },
          update: {},
          create: {
            id: imgId,
            imageUrl: img.url,
            description: img.desc,
            order: imgIndex - 1,
            portfolioItemId: portfolioItem.id,
          },
        });
        imgIndex++;
      }
      itemIndex++;
    }

    console.log(`Profesional procesado: ${p.username}`);
  }

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
