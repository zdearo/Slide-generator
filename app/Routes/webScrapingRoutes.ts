import Route from '@ioc:Adonis/Core/Route';

Route.post('/getLetra', 'WebScrapingController.getLetra');
Route.post('/criarApresentacao', 'SlideGeneratorController.criarApresentacao');
