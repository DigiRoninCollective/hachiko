import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.todo.create({
    data: {
      title: 'Setup Hachiko project',
      isCompleted: true,
    },
  })
  await prisma.todo.create({
    data: {
      title: 'Connect Supabase DB',
      isCompleted: true,
    },
  })
  await prisma.todo.create({
    data: {
      title: 'Test /todos page',
      isCompleted: false,
    },
  })
  console.log('Seeded todos')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
