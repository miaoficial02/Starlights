import { sticker } from '../lib/sticker.js';
import axios from 'axios';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchSticker = async (text, attempt = 1) => {
    try {
        const response = await axios.get(`https://kepolu-brat.hf.space/brat`, {
            params: { q: text },
            responseType: 'arraybuffer',
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 429 && attempt <= 3) {
            const retryAfter = parseInt(error.response.headers['retry-after'] || '5');
            await delay(retryAfter * 1000);
            return fetchSticker(text, attempt + 1);
        }
        throw error;
    }
};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat, `${emojis} *Uso incorrecto del comando.*\n\n*Ejemplo:*  ${usedPrefix + command} ${botname}`, m, rcanal);
    }

    try {
        const buffer = await fetchSticker(text);
        const stiker = await sticker(buffer, false, botname, nombre);

        if (stiker) {
            await conn.sendFile(
                m.chat,
                stiker,
                'sticker.webp',
                ``,
                m,
                true,
                {
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: false,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: packname,
                            body: `${botname}`,
                            mediaType: 2,
                            sourceUrl: redes,
                            thumbnail: catalogo
                        }
                    }
                },
                { quoted: m }
            );
        } else {
            throw new Error("No se pudo generar el sticker.");
        }
    } catch (error) {
        console.error(error);
        return conn.sendMessage(
            m.chat,
            { text: `${msm} *Ocurrió un error:* ${error.message}` },
            { quoted: m }
        );
    }
};

handler.command = ['brat'];
handler.tags = ['sticker'];
handler.help = ['brat *<texto>*'];

export default handler;