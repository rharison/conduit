import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import fastify from 'fastify'
import { env } from '@/helpers/env'
import { CreateUser } from '@/core/user/types'
import * as user from '@/ports/adapters/http/modules/user'

const PORT = env('PORT')
const app = fastify({ logger: true })

type ApiUsers = {
  Body: {
    user: CreateUser
  }
}

app.post<ApiUsers>('/api/users', async (req, reply) => {
  return pipe(
    req.body.user,
    user.registerUser,
    TE.map(result => reply.send(result)),
    TE.mapLeft(error => reply.status(422).send(error)),
  )()
})

export async function start () {
  try {
    await app.listen({ port: Number(PORT) })
    console.log(`server listening on port ${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
