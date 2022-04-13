-- CreateTable
CREATE TABLE "UserSubscriptionsOnSubreddix" (
    "subreddixId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubscriptionsOnSubreddix_pkey" PRIMARY KEY ("userId","subreddixId")
);

-- AddForeignKey
ALTER TABLE "UserSubscriptionsOnSubreddix" ADD CONSTRAINT "UserSubscriptionsOnSubreddix_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscriptionsOnSubreddix" ADD CONSTRAINT "UserSubscriptionsOnSubreddix_subreddixId_fkey" FOREIGN KEY ("subreddixId") REFERENCES "Subreddix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
