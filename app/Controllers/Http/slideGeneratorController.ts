import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PPTX from "nodejs-pptx";
let pptx = new PPTX.Composer();

export default class SlideGeneratorsController {

    public async criarApresentacao({ request: req, response: res }: HttpContextContract) {
        let musica = await req.all();
        
        await pptx.compose(pres => {
            pres.layout('LAYOUT_16x9');
            musica.letra.forEach((estrofe: Array<string>) => {
                pres.addSlide(slide => {
                    slide.addText(text => {
                        text.value(estrofe.join('\n'))
                            .x(100)
                            .y(100)
                            .fontSize(25)
                            .autoFit(true)
                            .textAlign('center')
                            .textVerticalAlign('center');

                    });
                });
            });
            pptx.save('./public/pptx/teste.pptx');
        });

        return res.download('./public/pptx/teste.pptx');
    }
}
