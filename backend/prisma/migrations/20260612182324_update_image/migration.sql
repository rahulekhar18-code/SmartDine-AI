-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "foodRating" INTEGER NOT NULL,
    "serviceRating" INTEGER NOT NULL,
    "cleanlinessRating" INTEGER NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "favouriteItem" TEXT NOT NULL,
    "suggestion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);
