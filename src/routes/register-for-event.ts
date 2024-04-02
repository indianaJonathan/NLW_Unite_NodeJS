import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/events/:eventId/attendees', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),
            }),
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                201: z.object({
                    attendeeId: z.number(),
                }),
            }
        }
    }, async (request, reply) => {
        const { eventId } = request.params;
        const { name, email } = request.body;

        const existingRegister = await prisma.attendee.findUnique({
            where: {
                eventId_email: {
                    eventId,
                    email,
                },
            },
            select: {
                id: true,
                name: true,
                event: {
                    select: {
                        title: true,
                    }
                }
            }
        });

        if (existingRegister) throw new Error(`Participante ${existingRegister.name} já está registrado no evento ${existingRegister.event.title}`);

        const [event, ammountOfAttendees] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId,
                }
            }),
            prisma.attendee.count({
                where: {
                    eventId,
                }
            }),
        ]);

        if (!event) throw new Error('Evento não encontrado');

        if (event.maximumAttendees && ammountOfAttendees >= event.maximumAttendees) throw new Error('Limite de participantes atingido!');

        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId,
            }
        });

        return reply.status(201).send({ attendeeId: attendee.id });
    });
}