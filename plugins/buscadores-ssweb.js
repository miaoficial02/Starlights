import axios from 'axios'

// Función para tomar captura de pantalla de una página web
export async function screenshotWebsite(url, type = 'desktop') {
    const types = {
        desktop: { device: 'desktop', fullPage: false },
        mobile: { device: 'mobile', fullPage: false },
        full: { device: 'desktop', fullPage: true }
    }

    if (!/^https?:\/\//.test(url)) {
        return {
            status: 'Error',
            message: 'URL inválida. ¡Por favor, proporciona una URL válida, Senpai tonto!'
        }
    }

    if (!(type in types)) {
        return {
            status: 'Error',
            message: 'Tipo no reconocido. Usa "desktop", "mobile" o "full", Senpai.'
        }
    }

    const { device, fullPage } = types[type]

    try {
        const payload = { url: url.trim(), device, fullPage }
        const res = await axios.post(
            'https://api.magickimg.com/generate/website-screenshot',
            payload,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://magickimg.com',
                    'Referer': 'https://magickimg.com',
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0'
                }
            }
        )

        const buffer = Buffer.from(res.data)
        const contentType = res.headers['content-type'] || 'image/png'
        const sizeKB = (res.headers['content-length'] / 1024).toFixed(2) + ' KB'

        return {
            status: 'Éxito',
            type,
            url,
            device,
            fullPage,
            contentType,
            sizeKB,
            buffer,
            base64: `data:${contentType};base64,${buffer.toString('base64')}`
        }

    } catch (e) {
        return {
            status: 'Error',
            message: e.message || 'Ocurrió un error al tomar la captura... perdóname, Senpai.'
        }
    }
}

// Handler para el bot de WhatsApp
let yeon = async (m, { conn, text, usedPrefix, command }) => {
    const args = text?.trim().split(/\s*\|\s*/)
    if (!args || args.length < 1) {
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        })
        return conn.sendMessage(m.chat, {
            text: `📸 *Senpai*, escribe la URL del sitio que deseas capturar.  
Ejemplo: *${usedPrefix + command}* https://anisaofc.my.id|desktop`
        })
    }

    const url = args[0]
    const type = args[1]?.toLowerCase() || 'desktop'

    try {
        await conn.sendMessage(m.chat, {
            react: { text: '🕒', key: m.key }
        })

        const result = await screenshotWebsite(url, type)

        if (result.status === 'Error') {
            await conn.sendMessage(m.chat, {
                react: { text: '❌', key: m.key }
            })
            return conn.sendMessage(m.chat, {
                text: `⚠️ *Ups, hubo un problema, Senpai!*  
${result.message}`
            })
        }

        await conn.sendMessage(m.chat, {
            image: result.buffer,
            caption: `✨ *¡Captura completada, Senpai!*  
📌 *URL:* ${result.url}  
🖥️ *Dispositivo:* ${result.device}  
🧾 *Página Completa:* ${result.fullPage ? 'Sí' : 'No'}  
📏 *Tamaño:* ${result.sizeKB}`
        })

        await conn.sendMessage(m.chat, {
            react: { text: '✅', key: m.key }
        })

    } catch (e) {
        console.error('Error:', e.message)
        await conn.sendMessage(m.chat, {
            react: { text: '❌', key: m.key }
        })
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Ups, ocurrió un error, Senpai!*  
Este servicio está presentando fallas. ¡Inténtalo más tarde! 😅`
        })
    }
}

yeon.help = ['ssweb <url>|<tipo>', 'screenshotweb <url>|<tipo>']
yeon.tags = ['herramientas']
yeon.command = /^(ssweb|screenshotweb)$/i
yeon.register = true
yeon.limit = true

export default yeon