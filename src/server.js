import fastify from 'fastify'
import fastifycors from '@fastify/cors'

const server = fastify({ logger: true })

server.addHook('onRequest', (request, reply, done) => {
  server.log.info('<<<<<<< onRequest')
  done()
})

server.addHook('preParsing', (request, reply, payload, done) => {
  server.log.info('<<<<<<< preParsing')
  done()
})

server.addHook('preValidation', (request, reply, done) => {
  server.log.info('<<<<<<< preValidation')
  done()
})

server.addHook('preHandler', (request, reply, done) => {
  server.log.info('<<<<<<< preHandler')
  done()
})

server.addHook('preSerialization', (request, reply, payload, done) => {
  server.log.info('<<<<<<< preSerialization')
  done()
})

server.addHook('onSend', (request, reply, payload, done) => {
  server.log.info('<<<<<<< onSend')
  done()
})

server.addHook('onResponse', (request, reply, done) => {
  server.log.info('<<<<<<< onResponse')
  done()
})

server.register(fastifycors, {
  methods: 'POST',
})

server.post('/test-route', (request, reply) => {
  server.log.info('<<<<<<< handler')
  reply.send('Okidoki')
})

const start = async () => {
  try {
    await server.listen({ port: 2090 })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()