import fastify from "fastify";
import { z } from "zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    APP_PORT: z.coerce.number(),
    DATABASE_URL: z.string().url(),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
    console.error(envServer.error.issues.map((issue) => {
        return `${issue.path[0]}: ${issue.message} (${issue.code})`
    }));
    throw new Error('Houve um problema com as variáveis de ambiente do projeto!');
    process.exit(1);
}

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);

export const envServerSchema = envServer.data;

app.listen({ port: envServerSchema.APP_PORT }).then(() => {
    console.log(`Servidor HTTP rodando na porta ${envServerSchema.APP_PORT} no modo ${envServerSchema.NODE_ENV}`);
});