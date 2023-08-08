import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import pptxgen from "pptxgenjs";

export default class SlideGeneratorsController {

    public async criarApresentacao({ request, response }: HttpContextContract) {
        const { titulo, letra } = request.all(); // Destructuring para obter o título e a letra da música

        try {
            const pptx = new pptxgen(); // Cria uma nova apresentação

            // Define o padrão de slide para a apresentação
            pptx.defineSlideMaster({
                title: "MASTER_SLIDE", // Nome do padrão
                background: { path: "public/img/ardosiaBG.jpg" }, // Imagem de fundo
            });

            // Adiciona o título da música no primeiro slide
            pptx.addSlide({ masterName: "MASTER_SLIDE" }).addText(titulo, {
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

            // Função auxiliar para adicionar slides para cada estrofe
            const addSlidesForEstrofes = async (estrofes: string[][]) => {
                await Promise.all(
                    estrofes.map(async (estrofe) => {
                        await pptx.addSlide({ masterName: "MASTER_SLIDE" }).addText(
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
                    })
                );
            };

            // Adiciona slides para cada estrofe da música em paralelo
            await addSlidesForEstrofes(letra);

            // Retornando a apresentação para o usuário
            const stream = await pptx.stream();
            response.header("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
            response.header("Content-Disposition", "attachment; filename=apresentacao.pptx");
            response.status(200).send(stream);
        } catch (err) {
            return this.handleError(response, err);
        }
    }

    private handleError(response: HttpContextContract['response'], error: Error) {
        return response.status(500).json({
            message: "Erro ao gerar a apresentação!: \n" + error,
        });
    }
}
