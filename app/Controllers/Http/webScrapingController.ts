import * as cheerio from "cheerio";
import axios from "axios";

export default class webScrapingController {
    //Função para buscar o HTML da página e retornar o documento
    public async getDoc(url: string): Promise<string | Error> {
        return axios.get(url)
            .then((response) => {
                //Verifica a formatação da URL
                if (!url.startsWith("https://www.letras.mus.br/")) {
                    throw new Error("URL inválida!"); // Lança um erro caso a URL não seja válida
                }

                const doc: string = response.data; // Busca o HTML da página
                return doc; // Retorna o documento
            })
            .catch((err: Error) => {
                console.log("Erro ao definir a URL: " + err); // Exibe mensagem de erro caso não consiga definir a URL
                return err; // Retorna o erro
            });
    }

    //Função para buscar a letra da música e retornar o título e a letra separada em um array
    public async getLetra({ request: req, response: res }): Promise<string> {
        const url: string = await req.all().url; //Recebe a URL da requisição
        const doc = await this.getDoc(url); //Busca o documento da página utilizando a função getDoc e passando a URL como parâmetro

        //Verifica se retornou um erro
        if (doc instanceof Error) {
            return "Erro ao definir a URL: " + doc.message;
        }

        console.log("URL definida com sucesso!");
        const pag = cheerio.load(doc); // Carrega a página HTML

        if (pag("div#js-lyric-cnt div.cnt-letra p").length == 0) {
            return "Erro ao buscar a letra da música!";
        }

        let letra: Array<Array<string>> = []; // Cria um array para armazenar a letra da música
        const titulo = pag("article div.cnt-head_title h1").text(); //Busca o título da música
        
        //Busca a letra da música e separa em um array
        pag("div#js-lyric-cnt div.cnt-letra p").each((_, elem) => {
            let estrofe = pag(elem); //Busca a estrofe
            let versos = estrofe.html()?.split("<br>") as string[]; //Separa a estrofe em versos
            letra.push(versos); //Adiciona os versos no array letra
        });

        // Retorna o título e a letra da música
        return res.json({
            titulo: titulo,
            letra: letra,
        });
    }
}
