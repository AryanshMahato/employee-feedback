// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
//
// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//
//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//
//   describe('when health endpoint is called with no mongo connection', function () {
//     it('should respond with 500', () => {
//       return request(app.getHttpServer())
//         .get('/app/health')
//         .expect(500)
//         .expect({
//           serverAlive: true,
//           mongoAlive: false,
//         });
//     });
//   });
// });
