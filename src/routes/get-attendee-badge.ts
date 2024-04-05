import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFound } from "./_errors/not-found";

export async function getAttendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/attendees/:attendeeId/badge', {
        schema: {
            summary: 'Busca as credenciais de um participante',
            tags: ['attendees'],
            params: z.object({
                attendeeId: z.coerce.number().int(),
            }),
            response: {
                200: z.object({
                    badge: z.object({
                        name: z.string(),
                        email: z.string(),
                        eventTitle:  z.string(),
                        checkInURL: z.string(),
                    }),
                }),
            },
        }
    }, async (request, reply) => {
        const { attendeeId } = request.params;

        const attendee = await prisma.attendee.findUnique({
            where: {
                id: attendeeId,
            },
            select: {
                name: true,
                email: true,
                event: {
                    select: {
                        title: true,
                    }
                }
            }
        });

        if (!attendee) throw new NotFound('Participante não encontrado!');

        const baseURL = `${request.protocol}://${request.hostname}`;

        const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);

        return reply.send({ 
            badge: {
                name: attendee.name,
                email: attendee.email,
                eventTitle: attendee.event.title,
                checkInURL: checkInURL.toString(),
            }
         });
    });
}