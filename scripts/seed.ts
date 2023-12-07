const { PrismaClient} = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.categoryCourse.createMany({
            data: [
                { name: "Ciencias de la computación"},
                { name: "Musica"},
                { name: "Fitness"},
                { name: "Fotografia"},
                { name: "Contabilidad"},
                { name: "Ingenieria"},
                { name: "Filmacion"},
            ]
        });

        console.log("Exito");
    } catch (error) {
        console.log("Error en el seeding de la base de datos de categorias", error);
    } finally {
        await database.$disconnect
    }
}
main();

