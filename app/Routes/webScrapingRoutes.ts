import Route from '@ioc:Adonis/Core/Route';

Route.post('/getLetra', 'webScrapingController.getLetra');
Route.post('/criarApresentacao', 'slideGeneratorController.criarApresentacao');
