-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "bio" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "image" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER,
    "movieTitle" TEXT,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movie" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_state" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "app_state_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "_UserFollow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFollow_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_user_like_post" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user_like_post_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_user_watch_list" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user_watch_list_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_movie_genre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_movie_genre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "post_authorId_createdAt_idx" ON "post"("authorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "movie_sourceId_key" ON "movie"("sourceId");

-- CreateIndex
CREATE INDEX "comment_postId_createdAt_idx" ON "comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "comment_authorId_createdAt_idx" ON "comment"("authorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE INDEX "_UserFollow_B_index" ON "_UserFollow"("B");

-- CreateIndex
CREATE INDEX "_user_like_post_B_index" ON "_user_like_post"("B");

-- CreateIndex
CREATE INDEX "_user_watch_list_B_index" ON "_user_watch_list"("B");

-- CreateIndex
CREATE INDEX "_movie_genre_B_index" ON "_movie_genre"("B");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollow" ADD CONSTRAINT "_UserFollow_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollow" ADD CONSTRAINT "_UserFollow_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_like_post" ADD CONSTRAINT "_user_like_post_A_fkey" FOREIGN KEY ("A") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_like_post" ADD CONSTRAINT "_user_like_post_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_watch_list" ADD CONSTRAINT "_user_watch_list_A_fkey" FOREIGN KEY ("A") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user_watch_list" ADD CONSTRAINT "_user_watch_list_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_genre" ADD CONSTRAINT "_movie_genre_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_movie_genre" ADD CONSTRAINT "_movie_genre_B_fkey" FOREIGN KEY ("B") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
