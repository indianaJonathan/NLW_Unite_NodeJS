import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/events/:eventId', {
        schema: {
            summary: 'Busca um evento',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        details: z.string().nullable(),
                        slug: z.string(),
                        maximumAttendees: z.number().int().nullable(),
                        attendeesAmount: z.number().int(),
                    }),
                }),
            },
        }
    }, async (request, reply) => {
        const { eventId } = request.params;

        const event = await prisma.event.findUnique({
            where: {
                id: eventId,
            },
            select: {
                id: true,
                title: true,
                details: true,
                slug: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        attendees: true,
                    }
                }
            }
        });

        if (!event) throw new NotFound('Evento não encontrado');

        return reply.send({
            event: {
                ...event,
                attendeesAmount: event._count.attendees,
            }
        });
    });
}