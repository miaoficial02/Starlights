import axios from 'axios'

const FILTROS = ['Coklat', 'Hitam', 'Nerd', 'Piggy', 'Carbon', 'Botak']

let yeon = async (m, { conn, text, usedPrefix, command }) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    
    if (!/image/.test(mime)) {
        await conn.sendMessage(m.chat, { 
            react: { text: "❌", key: m.key } 
        })
        return conn.sendMessage(m.chat, {
            text: `✨ *Filtros Disponibles* ✨
▏ [ *Hitam:* Waifu Oscura
▏ [ *Coklat:* Waifu Morena
▏ [ *Nerd:* Waifu Nerd
▏ [ *Piggy:* Waifu Piggy
▏ [ *Carbon:* Waifu Carbono
▏ [ *Botak:* Waifu Calva

🌟 *Cómo Usar* 🌟
Responde o envía una imagen con el texto *"${usedPrefix + command} <filtro>"*. Ejemplo: *"${usedPrefix + command} Hitam"*`
        })
    }

    try {
        await conn.sendMessage(m.chat, { 
            react: { text: "🎨", key: m.key } 
        })

        const buffer = await q.download()
        const base64Input = buffer.toString('base64')

        const args = text.split(' ')
        const filtroSeleccionado = args[0]?.toLowerCase() || 'hitam'
        const filtroValido = FILTROS.find(f => f.toLowerCase() === filtroSeleccionado)
        
        if (!filtroValido) {
            throw new Error(`Filtro no disponible. Elige entre: ${FILTROS.join(', ')}`)
        }

        const res = await axios.post('https://wpw.my.id/api/process-image', {
            imageData: base64Input,
            filter: filtroValido.toLowerCase()
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://wpw.my.id',
                'Referer': 'https://wpw.my.id/'
            }
        })

        const dataUrl = res.data?.processedImageUrl
        if (!dataUrl?.startsWith('data:image/')) {
            throw new Error('Error al procesar la imagen')
        }

        const base64Output = dataUrl.split(',')[1]
        const processedBuffer = Buffer.from(base64Output, 'base64')

        await conn.sendMessage(m.chat, {
            image: processedBuffer,
            caption: `✨ *Filtro Aplicado Correctamente* ✨
- - 🍀 *Filtro:* ${filtroValido}
- ⁠- 🔗 *Fuente:* https://wpw.my.id`
        })

        await conn.sendMessage(m.chat, { 
            react: { text: "✨", key: m.key } 
        })

    } catch (e) {
        console.error('Error:', e.message)
        await conn.sendMessage(m.chat, { 
            react: { text: "❌", key: m.key } 
        })
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Ups, ocurrió un error, Senpai!*  
${e.message || 'Este comando tiene problemas, intenta más tarde 😅'}`
        })
    }
}

yeon.help = ['wpw <filtro>', 'penghitaman <filtro>']
yeon.tags = ['ai']
yeon.command = ['wpw', 'penghitaman', 'wp']
yeon.register = true
yeon.limit = true
export default yeon