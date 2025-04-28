const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQuery() {
      try {
            const testContent = await prisma.content.findMany({
                  where: { id: 4 },
                  include: {
                        user: true
                  }
            });
            console.log(JSON.stringify(testContent, null, 2));
      } catch (error) {
            console.error('Error:', error);
      } finally {
            await prisma.$disconnect();
      }
}

testQuery();