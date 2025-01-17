import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import flixhq from './viewasian';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(flixhq, { prefix: '/' });

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Movies and TV Shows');
  });

  fastify.get('/:movieProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { movieProvider: string; page: number } = {
      movieProvider: '',
      page: 1,
    };

    queries.movieProvider = decodeURIComponent(
      (request.params as { movieProvider: string; page: number }).movieProvider
    );

    queries.page = (request.query as { movieProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.MOVIES.find(
      (provider: any) => provider.toString.name === queries.movieProvider
    );

    try {
      if (provider) {
        reply.redirect(`/kdrama/${provider.toString.name}`);
      } else {
        reply
          .status(404)
          .send({ message: 'Page not found, please check the providers list.' });
      }
    } catch (err) {
      reply
        .status(500)
        .send({ message: 'Something went wrong. Please try again later.' });
    }
  });
};

export default routes;
