import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class SlideGeneratorsController {

    public async criarApresentacao({ request: req, response: res }: HttpContextContract) {
        let musica = await req.all();
        
        
    }
}
