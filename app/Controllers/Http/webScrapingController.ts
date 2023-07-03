import * as cheerio from 'cheerio'
import * as axios from 'axios'

export default class webScrapingController {

    //Função para buscar o HTML da página e retornar o documento
    public async getDoc(url: string) {
        try{
            const doc = (await axios.default.get(url)).data; //Busca o HTML da página
            console.log('URL definida com sucesso!'); //Exibe mensagem de sucesso
            return doc; //Retorna o documento
        } catch (err) {
            return ('Erro ao definir a URL: ' + err); //Exibe mensagem de erro caso não consiga definir a URL
        }
    }

    //Função para buscar a letra da música e retornar o título e a letra separada em um array
    public async getLetra({request: req, response: res}) {
        const url = await req.all().url; //Recebe a URL da requisição
        const doc = await this.getDoc(url); //Busca o documento da página utilizando a função getDoc e passando a URL como parâmetro
        const $ = cheerio.load(doc); // Carrega a página HTML
        const titulo = ($('article div.cnt-head_title h1')).text(); //Busca o título da música
        let letra: any[] = []; // Cria um array para armazenar a letra da música
        
        //Busca a letra da música e separa em um array
        $('div#js-lyric-cnt div.cnt-letra p').each((_, elem) => {
            let estrofe = $(elem); //Busca a estrofe
            let versos = estrofe.html()?.split('<br>'); //Separa a estrofe em versos
            letra.push(versos); //Adiciona os versos no array letra
        });
        
        // Retorna o título e a letra da música
        return res.json({
            Titulo: titulo,
            Letra: letra
        });
    }
}
