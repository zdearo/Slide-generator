import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import * as cheerio from "cheerio";
import axios from "axios";

export default class webScrapingController {
    //Função para buscar o HTML da página e retornar o documento
    private async getDoc(url: string): Promise<string | Error> {
        return axios
            .get(url)
            .then((response) => {
                //Verifica a formatação da URL
                if (!url.startsWith("https://www.letras.mus.br/")) {
                    throw new Error("URL inválida!"); // Lança um erro caso a URL não seja válida
                }

                const doc: string = response.data; // Busca o HTML da página
                return doc; // Retorna o documento
            })
            .catch((err: Error) => {
                return err; // Retorna o erro
            });
    }

    //Função para buscar a letra da música e verificar a formatação
    public async formatarLetra(url: string) {
        return this.getDoc(url)
            .then((doc) => {
                // Verifica se doc teve retorno de um erro
                if (doc instanceof Error) {
                    throw new Error(doc.message); // Lança um erro caso doc seja um erro
                }

                console.log("URL definida com sucesso!");

                const pag = cheerio.load(doc); // Carrega a página HTML
                const letraContainer = pag("div#js-lyric-cnt div.cnt-letra p"); // Busca o container da letra da música

                //Verifica se a letra da música foi encontrada
                if (letraContainer.length == 0) {
                    throw new Error("Letra não encontrada!"); // Lança um erro caso a letra não seja encontrada
                }

                console.log("Letra encontrada com sucesso!");
                
                let musica: Array<string | Array<Array<any>>> = []; // Cria um array para armazenar a letra da música formatada
                musica.push(pag("article div.cnt-head_title h1").text()); //Busca e armaena o título da música
                const letra: Array<Array<string>> = []; // Cria um array para armazenar a letra da música
                
                //Busca a letra da música e separa em um array
                letraContainer.each((_, elem) => {
                    let estrofe = pag(elem); //Busca a estrofe
                    let versos = (estrofe.html() as string).split("<br>"); //Separa a estrofe em versos
                    letra.push(versos); //Adiciona os versos no array letra
                });
                
                // Percorre o array letra para separar as estrofes em partes de 4 versos
                letra.forEach((estrofe) => {
                    if(estrofe.length > 6) {
                        // Separa as estrofes em partes de 4 versos
                        for(let i = 0; i < estrofe.length; i += 4) {
                            let parte = estrofe.slice(i, i + 4); // Separa a estrofe em partes de 4 versos
                            letra.push(parte); // Adiciona a parte no array letra
                        }
                    }
                    // Remove o array original da letra
                    letra.shift();
                });
                
                musica.push(letra); // Adiciona a letra da música no array musica

                return musica; // Retorna o array musica
                
            })
            .catch((err: Error) => {
                return err; // Retorna o erro
            });
    }

    //Função para buscar a letra da música e retornar o título e a letra separada em um array
    public async getLetra({ request: req, response: res }: HttpContextContract) {
        const url: string = await req.all().url; //Recebe a URL da requisição
        return this.formatarLetra(url)
            .then((musica) => {
                // Retorna o título e a letra da música
                return res.status(200).json({
                    titulo: musica[0],
                    letra: musica[1],
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    error: "Erro ao definir a URL: " + err.message // Retorna o erro
                });
            });     
    }
}
