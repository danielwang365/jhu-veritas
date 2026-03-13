import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('changeme123', 12)

  // Create default admin user
  await prisma.user.upsert({
    where: { email: 'admin@veritasjhu.org' },
    update: {},
    create: {
      email: 'admin@veritasjhu.org',
      name: 'Admin',
      hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = [
    { name: 'Arts & Culture', slug: 'arts-and-culture' },
    { name: 'Theology & Philosophy', slug: 'theology-and-philosophy' },
    { name: 'Personal Essays', slug: 'personal-essays' },
    { name: 'Campus Life', slug: 'campus-life' },
    { name: 'Science & Faith', slug: 'science-and-faith' },
    { name: 'Book Reviews', slug: 'book-reviews' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
