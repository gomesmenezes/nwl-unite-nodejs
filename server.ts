import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import dotenv from 'dotenv'; // dotenv, que carrega automaticamente as variáveis de ambiente de um arquivo .env
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";

dotenv.config(); 

export const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)

app.listen({ port: 3333 }).then(() => {
    console.log('Server listening on port 3333');
})