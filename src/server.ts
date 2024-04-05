import fastify from "fastify";

import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { z } from "zod";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./error-handler";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    APP_PORT: z.coerce.number(),
    DATABASE_URL: z.string().url(),
    CORS_AUTHORIZED: z.string(),
    HOST: z.string(),
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

app.register(fastifyCors, {
    origin: envServerSchema.CORS_AUTHORIZED,
});

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'pass.in',
            description: 'Especificações da API para o backend da aplicação pass.in construída durante o NLW Unite da Rocketseat',
            version: '1.0.0',
        }
    },
    transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.setErrorHandler(errorHandler);

app.listen({ port: envServerSchema.APP_PORT, host: envServerSchema.HOST }).then(() => {
    console.log(`Servidor HTTP rodando na porta ${envServerSchema.APP_PORT} no modo ${envServerSchema.NODE_ENV}`);
});