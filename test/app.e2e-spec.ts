// Make a database for testing
// Everytime run test, clean up data
// We must call request like we do with Postman

// [IMPORTANT]
// Test Enviroment is difference with Dev Enviroment
// Should Have Clone/Dump/Test Database and isolated Service (Docker)

// How To Open Prisma Studio on Test Database
// npx dotenv -e .env.test prisma studio    

// How To Open Prisma Studio on Dev Database
// npx dotenv -e .env prisma studio    


// stores: store variable for the next request

import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

const { spec, request } = require('pactum');
const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`
describe('App EndToEnd tests', () => {

  let app: INestApplication
  let prismaService: PrismaService


  beforeAll(async () => {
    // Create Object which listen port 8000
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = appModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

    await app.init()
    await app.listen(PORT)

    // Need get Service here (Interact with DB for checking data)
    prismaService = app.get(PrismaService)
    // Clean all data in table before testing something
    await prismaService.cleanDatabase()
    request.setBaseUrl(BASE_URL)
  })

  afterAll(() => {
    app.close()
  })

  it.todo('should PASS: Conect PORT: ' + PORT)


  describe('Register', () => {
    it('should Register return code 201 ', async () => {
      return await spec()
        .post('/auth/register')
        .withBody({
          email: 'thanh.it17.test123@fpt.com',
          password: '@123456'
        })
        .expectStatus(201)
    })

    it('should show error with empty email', async () => {
      return await spec()
        .post('/auth/register')
        .withBody({
          email: '',
          password: '@123456'
        })
        .expectStatus(400)
    })

    it('should show error with invalid email', async () => {
      return await spec()
        .post('/auth/register')
        .withBody({
          email: 'thanh.it17.test123',
          password: '@123456'
        })
        .expectStatus(400)
    })

    it('should show error with empty password', async () => {
      return await spec()
        .post('/auth/register')
        .withBody({
          email: 'thanh.it17.test123@fpt.com',
          password: ''
        })
        .expectStatus(400)
    })
  })

  describe('Login', () => {
    it('should Login return code 201 ', async () => {
      return await spec()
        .post('/auth/login')
        .withBody({
          email: 'thanh.it17.test123@fpt.com',
          password: '@123456'
        })
        .expectStatus(201)
        .stores('accessToken', 'accessToken')
    })
  })

  describe('User', () => {
    describe('Get Detail User', () => {
      it('should show detail user with accessToken', async () => {
        return await spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
          // .inspect()
      })
    })
  })



  describe('Note', () => {
    describe('Insert Note', () => {
      it('should insert note', async () => {
        return await spec()
          .post('/notes')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .withBody({
            title: 'KIA K5',
            description: 'Thaco Motor',
            url: 'www.google.com.vn'
          })
          .expectStatus(201)
          .stores('nodeId01', 'id')
          .inspect()
      })
    })

    describe('Get All Notes', () => {
      it('should get all notes', async () => {
        return await spec()
          .get('/notes')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
      })
    })

    describe('Get Note By Id', () => {
      it('should get note by id', async () => {
        return await spec()
          .get('/notes/$S{nodeId01}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(200)
      })
    })

    describe('Delete Note', () => {
      it('should delete note', async () => {
        return await spec()
          .delete('/notes')
          .withQueryParams('id', '$S{nodeId01}')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}'
          })
          .expectStatus(204)
      })
    })
  })
})

