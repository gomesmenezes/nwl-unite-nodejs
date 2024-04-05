import fastify from "fastify";
import { z } from 'zod'
import dotenv from 'dotenv'; // dotenv, que carrega automaticamente as variáveis de ambiente de um arquivo .env
import { PrismaClient } from '@prisma/client'
import { generateSlug } from "./utils/generate-slug";

dotenv.config(); 
const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})

app.post('/events', async (req, res) => {

    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),
    })
    

    const {
        title, 
        details,
        maximumAttendees
    } = createEventSchema.parse(req.body) // O parse vai fazer a validação do createEventSchema, pegando o request.body e vendo se faz total sentido com a funcao

    const slug = generateSlug(title)

    const eventWithSameSlug = await prisma.event.findUnique({ // Verifica se tem um slug igual
        where: {
            slug: slug
        }
    })

    if (eventWithSameSlug !== null) {
        throw new Error('Another event with same title already exists.')
    }

    const event = await prisma.event.create({
        data: {
            title,
            details,
            maximumAttendees,
            slug
        }
    })

    // return  { eventId: event.id }
    return res.status(201).send({ eventId: event.id })
});

app.listen({ port: 3333 }).then(() => {
    console.log('Server listening on port 3333');
})