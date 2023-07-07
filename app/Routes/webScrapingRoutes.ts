import Route from '@ioc:Adonis/Core/Route';
import webScrapingController from 'App/Controllers/Http/webScrapingController';

Route.post('/getLetra', 'webScrapingController.getLetra');
Route.post('/criarApresentacao', 'slideGeneratorController.criarApresentacao');