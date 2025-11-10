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
  // Usamos 'upsert' para evitar duplicados si el script se corre múltiples veces.
  // 'upsert' = update (actualizar) o insert (insertar).
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

  // --- 2. Creación de la Persona para el Admin ---
  // El User depende de la Person, así que la creamos primero.
  //
  const adminPerson = await prisma.person.upsert({
    where: { dni: "00000000" }, // Usamos un DNI placeholder único para el admin
    update: {},
    create: {
      name: "Admin",
      lastName: "Tembiapo",
      dni: "00000000",
      contactPhone: "3794000000",
      isVerified: true, // El admin está verificado por defecto
    },
  });

  console.log(
    `Persona de Admin creada/asegurada: ${adminPerson.name} ${adminPerson.lastName}`
  );

  // --- 3. Creación del Usuario Admin ---
  //
  const adminUser = await prisma.user.upsert({
    where: { mail: "admin@tembiapo.com" },
    update: {
      password: hashPassword("admin1234"), // Resetea la pass si el admin ya existe
    },
    create: {
      username: "admin",
      mail: "admin@tembiapo.com",
      password: hashPassword("admin1234"), // Hasheamos la contraseña
      roleId: adminRole.id, // Conectamos con el Rol
      personId: adminPerson.id, // Conectamos con la Persona
    },
  });

  console.log(`Usuario Admin creado/asegurado: ${adminUser.mail}`);
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
