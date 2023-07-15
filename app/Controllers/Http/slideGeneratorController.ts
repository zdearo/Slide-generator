import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import pptxgen from "pptxgenjs";

export default class SlideGeneratorsController {

    public async criarApresentacao({request: req, response: res,}: HttpContextContract) {
        let musica = req.all(); //Recebe a letra da música pela requisição
        let pptx = new pptxgen(); //Cria uma nova apresentação

        //Define o padrão de slide para a apresentação
        pptx.defineSlideMaster({
            title: "MASTER_SLIDE", // Nome do padrão
            background: { path: "public/img/ardosiaBG.jpg" }, // Imagem de fundo
        });

        //Adiciona o título da música no primeiro slide
        pptx.addSlide({ masterName: "MASTER_SLIDE" }).addText(musica.titulo, {
            x: "0%", // Posição X do texto
            y: "0%", // Posição Y do texto
            h: "100%", // Altura da caixa de texto
            w: "100%", // Largura da caixa de texto
            align: "center", // Alinhamento do texto na caixa
            fontSize: 48, // Tamanho da fonte
            bold: true, // Negrito
            color: "FFFFFF", // Cor do texto
            fontFace: "Arial Black", // Fonte
        });

        //Adiciona um novo slide para cada estrofe da música
        await musica.letra.forEach((estrofe: Array<string>) => {
            pptx.addSlide({ masterName: "MASTER_SLIDE" }).addText(
                estrofe.join("\n"),
                {
                    x: 0.5, // Posição X do texto
                    y: 0.28, // Posição Y do texto
                    h: "90%", // Altura da caixa de texto
                    w: "90%", // Largura da caixa de texto
                    align: "center", // Alinhamento do texto na caixa
                    fontSize: 45 - estrofe.join("\n").length / 10, // Tamanho da fonte (quanto maior o texto, menor a fonte)
                    color: "FFFFFF", // Cor do texto
                    fontFace: "Arial Black", // Fonte
                }
            );
        });

        // Retornando a apresentação para o usuário
        return pptx.stream().
            then((stream) => {
                res.header("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
                res.header("Content-Disposition", "attachment; filename=apresentacao.pptx");
                res.status(200).send(stream);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({
                    message: "Erro ao gerar a apresentação!",
                });
            }
        );
    }
}
