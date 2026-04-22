// Import Prisma Client (the tool that lets you talk to your database)
const { PrismaClient } = require('@prisma/client');

// Create an instance of Prisma Client
const prisma = new PrismaClient();

async function main() {

  // ---------------------------
  // 👤 USERS (with UPSERT)
  // ---------------------------

  // Upsert = "update if exists, otherwise create"
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' }, // look for a user with this unique email
    update: {}, // if found, update nothing (basically keep it as is)
    create: {   // if NOT found, create a new user
      email: 'user1@example.com',
      password: 'password123',
      name: 'User One',
      role: 'ADMIN'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  // ---------------------------
  // ⏰ TIME BLOCKS
  // ---------------------------

  // Create a time block (9:00 - 10:00)
  const timeBlock1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2023-10-01T09:00:00Z'), // start time (UTC)
      endTime: new Date('2023-10-01T10:00:00Z')   // end time (UTC)
    }
  });

  // Create another time block (10:00 - 11:00)
  const timeBlock2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2023-10-01T10:00:00Z'),
      endTime: new Date('2023-10-01T11:00:00Z')
    }
  });

  // ⚠️ Note: Unlike users, this uses "create", not "upsert"
  // So if you run the seed multiple times, it will duplicate time blocks

  // ---------------------------
  // 📅 APPOINTMENTS
  // ---------------------------

  // Create an appointment for user1 at timeBlock1
  await prisma.appointment.create({
    data: {
      date: new Date('2023-10-01T09:00:00Z'),

      // Connect this appointment to an existing user
      user: { connect: { id: user1.id } },

      // Connect this appointment to an existing time block
      timeBlock: { connect: { id: timeBlock1.id } }
    }
  });

  // Create another appointment for user2 at timeBlock2
  await prisma.appointment.create({
    data: {
      date: new Date('2023-10-01T10:00:00Z'),
      user: { connect: { id: user2.id } },
      timeBlock: { connect: { id: timeBlock2.id } }
    }
  });

  // Log success message in the console
  console.log('✅ Seed ejecutado correctamente.');

  // ---------------------------
  // 🧹 OPTIONAL CLEANUP
  // ---------------------------

  /* 
  This would delete ALL users from the database.
  Useful during testing, but dangerous in production.
  */
  /* await prisma.user.deleteMany(); */
}

// Run the main function
main()
  .catch(e => {
    console.error(e);   // print any error
    process.exit(1);    // exit the process with failure
  })
  .finally(async () => {
    await prisma.$disconnect(); // close DB connection properly
  });