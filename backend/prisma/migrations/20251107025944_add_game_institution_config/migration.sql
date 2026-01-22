-- CreateTable
CREATE TABLE "game_institution_configs" (
    "id" UUID NOT NULL,
    "game_id" UUID NOT NULL,
    "institution_id" UUID NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "custom_config" JSONB,
    "device_settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_institution_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_institution_configs_game_id_institution_id_key" ON "game_institution_configs"("game_id", "institution_id");

-- AddForeignKey
ALTER TABLE "game_institution_configs" ADD CONSTRAINT "game_institution_configs_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_institution_configs" ADD CONSTRAINT "game_institution_configs_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
