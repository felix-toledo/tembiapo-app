-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('ok', 'pending', 'rejected', 'okByAdmin');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "mail" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "is_oauth_user" BOOLEAN NOT NULL DEFAULT false,
    "hash_reset_password" TEXT,
    "hash_reset_password_expires_at" TIMESTAMP(3),
    "role_id" TEXT NOT NULL,
    "person_id" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "dni" VARCHAR(11),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "whatsapp_contact" TEXT NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "front_dni_picture_url" TEXT NOT NULL,
    "verified_picture_url" TEXT NOT NULL,
    "status" "verification_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "person_id" TEXT NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lucide_icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_area" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "service_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "professional_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,

    CONSTRAINT "portfolio_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_image" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "portfolio_item_id" TEXT NOT NULL,

    CONSTRAINT "portfolio_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_professional" (
    "id" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professional_id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,

    CONSTRAINT "field_professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_professional" (
    "id" TEXT NOT NULL,
    "is_main" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "professional_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,

    CONSTRAINT "area_professional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_mail_key" ON "user"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "user_person_id_key" ON "user"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "person_dni_key" ON "person"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "professional_user_id_key" ON "professional"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_person_id_key" ON "verification"("person_id");

-- CreateIndex
CREATE INDEX "verification_status_idx" ON "verification"("status");

-- CreateIndex
CREATE UNIQUE INDEX "field_name_key" ON "field"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_area_postalCode_key" ON "service_area"("postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "service_area_city_province_country_key" ON "service_area"("city", "province", "country");

-- CreateIndex
CREATE INDEX "portfolio_item_professional_id_idx" ON "portfolio_item"("professional_id");

-- CreateIndex
CREATE INDEX "portfolio_image_portfolio_item_id_idx" ON "portfolio_image"("portfolio_item_id");

-- CreateIndex
CREATE INDEX "field_professional_professional_id_idx" ON "field_professional"("professional_id");

-- CreateIndex
CREATE INDEX "field_professional_field_id_idx" ON "field_professional"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "field_professional_professional_id_field_id_key" ON "field_professional"("professional_id", "field_id");

-- CreateIndex
CREATE INDEX "area_professional_professional_id_idx" ON "area_professional"("professional_id");

-- CreateIndex
CREATE INDEX "area_professional_area_id_idx" ON "area_professional"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "area_professional_professional_id_area_id_key" ON "area_professional"("professional_id", "area_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- CreateIndex
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token"("user_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification" ADD CONSTRAINT "verification_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_item" ADD CONSTRAINT "portfolio_item_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_item" ADD CONSTRAINT "portfolio_item_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_image" ADD CONSTRAINT "portfolio_image_portfolio_item_id_fkey" FOREIGN KEY ("portfolio_item_id") REFERENCES "portfolio_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_professional" ADD CONSTRAINT "field_professional_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_professional" ADD CONSTRAINT "field_professional_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_professional" ADD CONSTRAINT "area_professional_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_professional" ADD CONSTRAINT "area_professional_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "service_area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
