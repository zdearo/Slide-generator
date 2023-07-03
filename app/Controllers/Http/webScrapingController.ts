import * as cheerio from 'cheerio'
import * as axios from 'axios'
import { get } from 'cheerio/lib/api/traversing';

export default class webScrapingController {

    public async getDoc(url: string) {
        try{
            const doc = await axios.default.get(url);
            console.log('URL definida com sucesso!');
            return doc.data;
        } catch (err) {
            return ('Erro ao definir a URL: ' + err);
        }
    }

    public async getLetra({request: req, response: res}) {
        const url = await req.all().url;
        const doc = await this.getDoc(url);
        const $ = cheerio.load(doc);
        const letra = $('div#js-lyric-cnt div.cnt-letra');
        const titulo = $('article div.cnt-head_title h1');

        return res.json({
            titulo: titulo.text(),
            letra: letra.text()
        });
    }


}
