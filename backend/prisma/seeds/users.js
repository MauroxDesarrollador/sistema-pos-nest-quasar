const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function parserPassword(password) {
  return await crypto.createHash('md5').update(password).digest('hex');
}

async function fakeUsers() {
  
  const Users = [
    {
      name: 'admin',
      email: "admin@gmail.com",
      password: await parserPassword("admin"),
      role:"ADMIN"
    },
    {
      name: 'cajero',
      email: "cajero@gmail.com",
      password: await parserPassword("cajero"),
      role:"CAJERO"
    },
    {
      name: 'analista',
      email: "analista@gmail.com",
      password: await parserPassword("analista"),
      role:"ANALISTA"
    }
  ];

  for (const [index, element]  of Users.entries()) {
    await prisma.User.upsert({
      where: { 
        email: element.email 
      },
      create: element,
      update: element
    });
  }
}

module.exports = fakeUsers;