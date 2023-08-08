import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as cheerio from "cheerio";
import axios from "axios";

export default class webScrapingController {
    // Função para buscar o HTML da página e retornar o documento
    private async getDoc(url: string): Promise<string> {
        const response = await axios.get(url);
        // Verifica a formatação da URL
        if (!url.startsWith("https://www.letras.mus.br/")) {
            throw new Error("URL inválida! Por favor, insira uma URL válida de música do site letras.mus.br");
        }
        return response.data;
    }

    // Função para buscar a letra da música e verificar a formatação
    private async formatarLetra(url: string): Promise<[string, string[][]]> {
        const doc = await this.getDoc(url); // Recebe o documento da página
        const pag = cheerio.load(doc); // Carrega o documento da página
        const letraContainer = pag("div#js-lyric-cnt div.cnt-letra p"); // Busca o elemento que contém a letra da música

        // Verifica se a letra da música foi encontrada
        if (letraContainer.length === 0) {
            throw new Error("Letra não encontrada! Verifique se o link é de uma música"); // Lança um erro caso a letra não seja encontrada
        }

        const musica: [string, string[][]] = [pag("article div.cnt-head_title h1").text(), []]; // Array para armazenar o título e a letra da música

        // Busca a letra da música e separa em um array
        letraContainer.each((_, elem) => { // Percorre cada elemento da letra da música
            const estrofe = pag(elem); // Recebe o elemento atual
            const versos = (estrofe.html() as string).split("<br>"); // Separa os versos da estrofe em um array
            musica[1].push(versos); // Adiciona os versos da estrofe no array musica
        });

        //Identifica se existe uma estrofe maior que 6 versos, caso exista, separa em estrofes de no máximo 4 versos cada, apagando a estrofe original
        for (let i = 0; i < musica[1].length; i++) {
            if (musica[1][i].length > 5) { // Verifica se a estrofe possui mais de 5 versos
                let estrofe = musica[1][i]; // Recebe a estrofe com mais de 5 versos
                let estrofe1 = estrofe.slice(0, 4); // Separa a estrofe em duas estrofes de 4 versos cada
                let estrofe2 = estrofe.slice(4, estrofe.length); // Separa a estrofe em duas estrofes de 4 versos cada
                musica[1].splice(i, 1, estrofe1, estrofe2); // Apaga a estrofe original e adiciona as duas novas estrofes
            }
        } 

        return musica; // Retorna o array musica
    }

    //Função para buscar a letra da música e retornar o título e a letra separada em um array
    public async getLetra({ request: req, response: res }: HttpContextContract) {
        try {
            const url: string = await req.input('url');
            const musica = await this.formatarLetra(url);

            return res.status(200).json({
                titulo: musica[0],
                letra: musica[1],
            });
        } catch (err) {
            return this.handleError(res, err);
        } 
    }

    private handleError(response: HttpContextContract['response'], error: Error) {
        return response.status(500).json({
            error: error.message,
        });
    }
}
