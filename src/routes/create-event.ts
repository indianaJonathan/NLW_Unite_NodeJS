import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";
import { FastifyInstance } from "fastify";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/events', {
    schema: {
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().optional().nullable(),
        slug: z.string().optional(),
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid(),
        }),
      },
    }
  }, async (request, reply) => {
    const {
      title,
      details,
      slug,
      maximumAttendees,
    } = request.body;

    let new_slug: string | undefined = undefined;
    if (slug) {
      new_slug = generateSlug(slug);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug: new_slug,
        }
      });

      if (eventWithSameSlug) throw new Error('Outro evento com o mesmo slug já existe!');
    }

    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendees,
        slug: new_slug,
      },
      select: {
        id: true,
        title: true,
        details: true,
        maximumAttendees: true,
        slug: true,
      }
    });

    return reply.status(201).send({ eventId: event.id });
  })
}