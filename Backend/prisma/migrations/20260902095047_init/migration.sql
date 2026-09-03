-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "vehicleRegistration" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "towingRequired" BOOLEAN NOT NULL,
    "damageSeverity" TEXT NOT NULL,
    "severityScore" INTEGER,
    "recommendedRouting" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);
