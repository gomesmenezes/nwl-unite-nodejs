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
                })
            }
        }
    }, async (request, reply) => {
        const { eventId } = request.params
        const { name, email } = request.body;

        const attendeeFromEmail = await prisma.attende.findUnique({ // Verifica se tem um slug igual
            where: {
                eventId_email: {
                    email,
                    eventId
                }
            }
        })
    
        if (attendeeFromEmail !== null) {
            throw new Error('This email is already registered for this event.')
        }


        const [event, ammountOfAttendeesForEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),

            prisma.attende.count({
                where: {
                    eventId
                }
            })
        ])

    
        if (event?.maximumAttendees && ammountOfAttendeesForEvent >= event?.maximumAttendees) {
            throw new Error('Number max of attendees exceeded')
        }


        const attendee = await prisma.attende.create({
            data: {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({ attendeeId: attendee.id }) 
    })
}