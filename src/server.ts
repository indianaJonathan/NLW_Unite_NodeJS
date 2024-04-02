import fastify from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = fastify();

const prisma = new PrismaClient({
    log: ["query"],
});

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    APP_PORT: z.coerce.number(),
    DATABASE_URL: z.string().url(),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
    console.error(envServer.error.issues.map((issue) => {
        return `${issue.path[0]}: ${issue.message} (${issue.code})`
    }));
    throw new Error('Houve um problema com as variáveis de ambiente do projeto!');
    process.exit(1);
}

export const envServerSchema = envServer.data;

app.post('/events', async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().optional(),
        slug: z.string().optional(),
    });

    const data = createEventSchema.parse(request.body);

    const event = await prisma.event.create({
        data,
        select: {
            id: true,
            title: true,
            details: true,
            maximumAttendees: true,
            slug: true,
        }
    });

    return reply.status(201).send({ event });
})

app.listen({ port: envServerSchema.APP_PORT }).then(() => {
    console.log(`HTTP Server running at port ${envServerSchema.APP_PORT} in ${envServerSchema.NODE_ENV} mode`);
});