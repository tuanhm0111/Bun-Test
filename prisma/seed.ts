import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create a user test
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      password: bcrypt.hashSync('password', 12), // Hash the password
      firstName: 'Test',
      lastName: 'User',
      avatar: null,
    },
  });

  // Create a category test
  const category = await prisma.category.create({
    data: {
      name: 'Tech',
      slug: 'tech',
      description: 'Technology related posts',
    },
  });

  // Create a post test
  const post = await prisma.post.create({
    data: {
      title: 'Welcome to Prisma',
      slug: 'welcome-to-prisma',
      content: 'This is a seeded post.',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: user.id,
      categoryId: category.id,
    },
  });

  // Comment test
  await prisma.comment.create({
    data: {
      content: 'Great post!',
      postId: post.id,
      userId: user.id,
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
