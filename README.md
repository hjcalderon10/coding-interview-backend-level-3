# Readme updated after guidelines. [Express link](#updates-from-developer)  🚂


# Bienvenido al coding-interview-backend-level-3 - Parte I

## Descripción
Eres el Senior Developer de tu equipo en El Dorado, y te han dado la responsabilidad de desarrollar un nuevo feature que nos pide el equipo de producto:

> API REST que permita realizar operaciones CRUD sobre una entidad de tipo `Item`.
>
> La entidad tiene 3 campos: `id`, `name` y `price`.
>
>

# Requisitos:
- Si el servicio se reinicia, los datos no se pueden perder.
- Tienes que implementar tu codigo como si estuvieses haciendo un servicio para El Dorado listo para produccion.
- Completar la implementación de toda la funcionalidad de forma tal de que los tests e2e pasen exitosamente.


### Que puedes hacer: 
- ✅ Modificar el código fuente y agregar nuevas clases, métodos, campos, etc.
- ✅ Cambiar dependencias, agregar nuevas, etc.
- ✅ Modificar la estructura del proyecto (/src/** es todo tuyo)
- ✅ Elegir una base de datos
- ✅ Elegir un framework web
- ✅ Crear tests
- ✅ Cambiar la definición del .devContainer


### Que **no** puedes hacer:
- ❌ No puedes modificar el archivo original /e2e/index.test.ts (pero puedes crear otros test si lo deseas)
- ❌ El proyecto debe usar Typescript 
- ❌ Estresarte 🤗


## Pasos para comenzar
1. Haz un fork usando este repositorio como template
2. Clona el repositorio en tu máquina
3. Realiza los cambios necesarios para que los tests pasen
4. Sube tus cambios a tu repositorio
5. Avísanos que has terminado
6. ???
7. PROFIT

### Cualquier duda contactarme a https://www.linkedin.com/in/andreujuan/

# Updates from Developer

## Guidelines broken
This API have been considered to be used for longer, therefore it have been thought to have API versions in place.
Knowing that, the file e2e/index.test.ts have been slightly modified to use the versions.

> From
> const response = await server.inject({
>        method: 'GET',
>        url: '/items',
>      })
> 
> To
> const response = await server.inject({
>        method: 'GET',
>        url: '/v1/items',
>      })

### If this is a deal breaker, is possible to update and remove the versioning in no time 🫣

## Scripts in package.json

```json
{
    "scripts": {
        "build": "tsc && sh fix-imports.sh",
        "dev": "NODE_PATH=./src NODE_ENV=development ts-node -r tsconfig-paths/register src/index.ts | pino-pretty",
        "migrate:latest": "npx knex migrate:latest --knexfile knexfile.js",
        "migrate:rollback": "npx knex migrate:rollback --knexfile knexfile.js",
        "start:dev": "dotenv -e .env -- npm run dev",
        "start": "node dist/index.js",
        "test:e2e": "jest e2e --config jest.config.e2e.js",
        "test:unit": "dotenv -e .env.testing -- jest test --config jest.config.js"
    }
}
```

## Project structure

```
coding-interview-backend-level-3/
├── .devcontainer/
│   ├── devcontainer.json
│   ├── Dockerfile                          -> development purpose
│   e2e/
│   ├── index.test.ts                       -> Lightly modified
│   migrations/
│   ├── 20250305191100_create_items_table.js
├── src/
│   ├── domains/item/                       -> DDD, can be splitted out when item is confirmed to be an identity from bigger(s) business layer(s).
│   │   ├── controllers/
│   │   │   ├── item.controller.ts
│   │   │   ├── item.routes.ts
│   │   ├── dto/
│   │   │   ├── item.dto.ts
│   │   ├── repositories/
│   │   │   ├── item.repository.interface.ts
│   │   │   ├── item.repository.ts
│   │   ├── services/
│   │   │   ├── item.service.ts
│   ├── entities/
│   │   ├── item.entity.ts
│   ├── errors/
│   │   ├── validation.error.ts
│   ├── repositories/
│   │   ├── models/
│   │   │   ├── item.model.ts
│   │   ├── storage/
│   │   │   ├── db.interface.ts
│   │   │   ├── pg.database.ts
│   ├── server/
│   │   ├── config/
│   │   │   ├── environment.ts
│   │   ├── middlewares/
│   │   │   ├── error-handler.middleware.ts
│   │   │   ├── request-logger.middleware.ts
│   │   ├── healthcheck.ts
│   │   ├── server.ts
│   ├── services/logger/
│   │   ├── logger-context.service.ts
│   │   ├── logger.service.ts
│   ├── index.ts
├── test/
│   ├── domains/item/
│   │   ├── controllers/
│   │   │   ├── item.controller.test.ts
│   │   │   ├── item.routes.test.ts
│   │   ├── repositories/
│   │   │   ├── item.repository.test.ts
│   │   ├── services/
│   │   │   ├── item.service.test.ts
│   ├── repositories/storage/
│   │   ├── pg.database.test.ts
│   ├── server/
│   │   ├── config/
│   │   │   ├── environment.test.ts
│   │   ├── middlewares/
│   │   │   ├── error-handler.middleware.test.ts
│   │   │   ├── request-logger.middleware.test.ts
│   │   ├── healthcheck.test.ts
│   │   ├── server.test.ts
│   ├── services/logger
│   │   ├── logger-context.service.test.ts
│   │   ├── logger.service.test.ts
├── .env*
├── .gitignore
├── .pretierrc
├── docker-compose.test.yml
├── docker-compose.yml
├── Dockerfile.production
├── eslint.config.mjs
├── fix-imports.sh
├── jest.config.e2e.js
├── jest.config.js
├── jest.setup.js
├── knexfile.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
└── tsconfig.test.json
```

## Next Steps

1. **Additional tests**: extend unit tests into integration tests.
2. **Authentication/Autorization**: Add middlewares to manage autentication/autorization.
3. **Add cache**: Redis is already in the prod docker-compose. Could be added to reduce db bottleneck.
4. **Rate Limiter**: To add rate limiters for sensible/all endpoints.
5. **CI/CD**: Configure CI/CD with GitHub, Bitbucket or Jenkins, attach env vars onto the docker-compose for prod/dev env purposes.
4. **Historical data**: Save historical data under a long living db like Snowflake.
5. **SonarQube**: Get a SonarQube server and guarantee a minimum Quality Gate.
6. **APM (Application Performance Monitoring)**: To integrate an APM (DataDog, Splunk, ELK) to provide insight over key performance metrics.
7. **Monitoring**: Attach the service to a dashboard to track number of instances, performance in prod/dev environment. Generate alerts.
8. **Optimization**: To run profilers and check the app performance.
9. **Swagger**: Have swagger in place for documentation and API sharing purposes. *Do not autogenerate prod code with swagger*.
10. **Postman collection**: Save and share a postman collection for colleagues that will continue working on this project.

## Project Timestamps
### Total time spent on the project: 18 hours.
- Pre coding: 1 hour
- Coding session 1: 2 hours
- Coding session 2: 4 hours
- Coding session 3: 3 hours
- Coding session 4: 2 hours
- Coding session 5: 6 hours

## Challenges
These have consumed me long time 😣
- Tried to use Prisma and TypeORM for DB management. Huge time spent trying to debug them
- Unit testing, mocks never stop to be a surprise.
