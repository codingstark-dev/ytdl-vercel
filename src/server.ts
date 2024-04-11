import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import z from 'zod';
import { downloadVideo, getVideoInfo } from './download';

const app = fastify();

const PORT = process.env.PORT ?? 3333;

app.register(fastifyCors, {
  // TODO: update this when front be in prod
  origin: '*',
  methods: ['GET', 'POST'],
});

app.get('/info/:urlCode', async (request, reply) => {
  const createSchema = z.object({
    urlCode: z.string(),
  });

  const { urlCode } = createSchema.parse(request.params);

  const videoInfo = await getVideoInfo(urlCode);

  console.log(videoInfo);

  return reply.status(200).send(videoInfo);
});

app.post('/download', async (request, reply) => {
  const createSchema = z.object({
    urlCode: z.string(),
  });

  const { urlCode } = createSchema.parse(request.body);

  const result = await downloadVideo(urlCode);

  return reply.status(200).send(result);
});

app
  .listen({
    port: Number(PORT),
  })
  .then(() => {
    console.log(`🚀 HTTP server running on port ${PORT}!`);
  });
