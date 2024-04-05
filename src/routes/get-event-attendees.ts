import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/events/:eventId/attendees', {
        schema: {
            summary: 'Busca os participantes de um evento',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            querystring: z.object({
                query: z.string().nullish(),
                pageIndex: z.string().nullable().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    attendees: z.array(
                        z.object({
                            id: z.number().int(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            checkedInAt: z.date().nullable(),
                        }),
                    ),
                }),
            }
        }
    }, async (request, reply) => {
        const { eventId } = request.params;
        const { query, pageIndex } = request.query;

        const attendees = await prisma.attendee.findMany({
            where: query ? 
                {
                    eventId,
                    name: {
                        contains: query,
                    }
                }
            : 
                {
                    eventId,
                },
            take: 10,
            skip: pageIndex * 10,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                checkIn: {
                    select: {
                        createdAt: true,
                    }
                }
            }
        });

        return reply.send({ 
            attendees: attendees.map((attendee) => {
                return {
                    ...attendee,
                    checkIn: undefined,
                    checkedInAt: attendee.checkIn?.createdAt ?? null,
                }
            }),
        });
    });
}