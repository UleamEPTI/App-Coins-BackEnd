// COMENTADO: EstudiantesController quedó desactivado (Bachillero pidió
// quitar la gestión de estudiante individual). Este test se reactiva junto
// con el controller si se vuelve a necesitar.
//
// import { Test, TestingModule } from '@nestjs/testing';
// import { EstudiantesController } from './estudiantes.controller';
//
// describe('EstudiantesController', () => {
//   let controller: EstudiantesController;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [EstudiantesController],
//     }).compile();
//
//     controller = module.get<EstudiantesController>(EstudiantesController);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });