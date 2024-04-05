import { prisma } from "../src/lib/prisma";

async function seed() {
    await prisma.event.create({
        data: {
            id: "c7c7a8f1-0237-4def-a92a-726ecb8dbae9",
            title: "Primeiro evento",
            details: "Primeiro evento criado pelo seed",
            maximumAttendees: 120,
        }
    });
}

seed().then(() => {
    console.log('Dados incluídos na base de dados');
    prisma.$disconnect();
});