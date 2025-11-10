# 🐘 Base de Datos PostgreSQL (Desarrollo)

Este entorno levanta una base de datos **PostgreSQL 18** lista para usar en desarrollo, mediante Docker Compose.  
Ideal para integrarse con Prisma u otros ORMs.

---

## 🚀 Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.
- [Docker Compose](https://docs.docker.com/compose/) (viene incluido con Docker Desktop).
- Archivo `.env` con tus variables opcionales (ver ejemplo abajo).

---

## ⚙️ Configuración

### 1. Variables de entorno

Podés definirlas en un archivo `.env` (opcional):

```env
DB_USER=tembiapo_dev
DB_PASSWORD=supersecretdev
DB_NAME=tembiapo_dev_db
````

Si no existen, se usarán esos valores por defecto igualmente.

---

### 2. Estructura del proyecto

```
.
├── docker-compose.yml
├── docker-data/
│   └── postgres/        # Volumen con los datos persistentes
└── .env                 # (opcional)
```

---

## 🧱 Levantar la base de datos

Ejecutá desde la raíz del proyecto:

```bash
docker-compose up -d
```

Esto:

* Descarga la imagen oficial de **Postgres 18**.
* Crea el contenedor `tembiapo_db_dev`.
* Expone el puerto `5432`.
* Persiste los datos en `./docker-data/postgres`.

---

## 🔍 Verificar que funciona

Listar contenedores activos:

```bash
docker ps
```

Ver logs de inicio:

```bash
docker logs tembiapo_db_dev
```

Entrar al contenedor:

```bash
docker exec -it tembiapo_db_dev psql -U tembiapo_dev -d tembiapo_dev_db
```

---

## 🌐 Conexión desde Prisma

En tu archivo `.env` de la app (no el del Docker):

```env
DATABASE_URL="postgresql://tembiapo_dev:supersecretdev@localhost:5432/tembiapo_dev_db?schema=public"
```

Luego:

```bash
npx prisma migrate dev
npx prisma studio
```

---

## 🧹 Comandos útiles

* **Detener contenedor**

  ```bash
  docker-compose down
  ```

* **Detener y eliminar datos**

  ```bash
  docker-compose down -v
  rm -rf ./docker-data/postgres
  ```

---

## 🧩 Notas

* Compatible con **PostgreSQL 18+** (nuevo path de datos: `/var/lib/postgresql`).
* No uses `latest` en producción; fijá una versión estable (por ejemplo, `postgres:18`).
* El volumen mantiene los datos entre reinicios.

---
