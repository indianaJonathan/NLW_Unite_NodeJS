import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getEvents(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/events', {
        schema: {
            summary: 'Busca todos os eventos',
            tags: ['events'],
            querystring: z.object({
                query: z.string().nullish(),
                pageIndex: z.string().nullable().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    events: z.array(
                        z.object({
                            id: z.string().uuid(),
                            title: z.string(),
                            details: z.string().nullable(),
                            slug: z.string(),
                            maximumAttendees: z.number().int().nullable(),
                            attendeesAmount: z.number().int(),
                        })
                    ),
                    total: z.number().int(),
                }),
            },
        }
    }, async (request, reply) => {
        const { query, pageIndex } = request.query;

        const events = await prisma.event.findMany({
            where: query ? 
                {
                    title: {
                        contains: query,
                    }
                }
            : 
                undefined,
            take: 10,
            skip: pageIndex * 10,
            orderBy: {
                title: 'asc',
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

        if (!events) throw new NotFound('Eventos não encontrados');

        return reply.send({
            events: events.map((event) => {
                return {
                    ...event,
                    attendeesAmount: event._count.attendees,
                }
            }),
            total: events.length,
        });
    });
}