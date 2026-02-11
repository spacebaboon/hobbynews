-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "surfaceColor" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "textMutedColor" TEXT NOT NULL,
    "accentColor" TEXT NOT NULL,
    "borderColor" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_slug_key" ON "Theme"("slug");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS on Theme table
ALTER TABLE "Theme" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public themes"
  ON "Theme" FOR SELECT
  USING ("isPublic" = true);

CREATE POLICY "Admins can manage themes"
  ON "Theme" FOR ALL
  USING (
    EXISTS (SELECT 1 FROM "User" WHERE id = auth.uid()::text AND "isAdmin" = true)
  );
