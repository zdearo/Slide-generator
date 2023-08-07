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
    public async verLetra({ request: req, response: res }: HttpContextContract) {
        const url: string = await req.all().url; //Recebe a URL da requisição
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
                
                const titulo = pag("article div.cnt-head_title h1").text(); //Busca o título da música
                const letra: Array<Array<string>> = []; // Cria um array para armazenar a letra da música
                
                //Busca a letra da música e separa em um array
                letraContainer.each((_, elem) => {
                    let estrofe = pag(elem); //Busca a estrofe
                    let versos = (estrofe.html() as string).split("<br>"); //Separa a estrofe em versos
                    letra.push(versos); //Adiciona os versos no array letra
                });

                //Verifica se a letra da música está em 1 estrofe e separa em estrofes de 4 versos
                if (letra.length == 1) {
                    
                }

                // Retorna a letra e título da música
                return res.status(200).json({
                    titulo: titulo,
                    letra: letra,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    error: "Erro ao definir a URL: " + err.message // Retorna o erro
                });
            });
    }

    //Função para buscar a letra da música e retornar o título e a letra separada em um array
    public async getLetra({ request: req, response: res }: HttpContextContract) {
        const url: string = await req.all().url; //Recebe a URL da requisição
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

                const titulo = pag("article div.cnt-head_title h1").text(); //Busca o título da música
                const letra: Array<Array<string>> = []; // Cria um array para armazenar a letra da música
                
                //Busca a letra da música e separa em um array
                letraContainer.each((_, elem) => {
                    let estrofe = pag(elem); //Busca a estrofe
                    let versos = (estrofe.html() as string).split("<br>"); //Separa a estrofe em versos
                    letra.push(versos); //Adiciona os versos no array letra
                });

                // Retorna o título e a letra da música
                return res.status(200).json({
                    titulo: titulo,
                    letra: letra,
                });
            })
            .catch((err: Error) => {
                return res.status(500).json({
                    error: "Erro ao definir a URL: " + err.message // Retorna o erro
                });
            });
    }
}
