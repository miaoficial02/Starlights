import axios from 'axios'
import fetch from 'node-fetch' // si usas Node.js, instala con npm i node-fetch@2

const fstik = {
  api: {
    base: 'https://api.fstik.app',
    endpoints: {
      direct: '/getStickerSetByName',
      search: '/searchStickerSet'
    }
  },

  headers: {
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json',
    origin: 'https://webapp.fstik.app',
    referer: 'https://webapp.fstik.app/',
    'user-agent': 'NB Android/1.0.0'
  },

  // Buscar un set por nombre exacto
  name: async (name) => {
    if (!name || typeof name !== 'string') {
      return { success: false, code: 400, result: { error: 'El nombre no puede estar vacío' } }
    }
    try {
      const res = await axios.post(
        fstik.api.base + fstik.api.endpoints.direct,
        { name, user_token: null },
        { headers: fstik.headers }
      )
      const set = res.data?.result
      if (!set) {
        return { success: false, code: 404, result: { error: `No se encontró el set "${name}"` } }
      }
      return { success: true, code: 200, result: set }
    } catch (err) {
      return { success: false, code: err?.response?.status || 500, result: { error: 'Error en la API', details: err.message } }
    }
  },

  // Buscar sets con query libre
  search: async ({ query = '', skip = 0, limit = 15, type = '', kind = 'regular' }) => {
    try {
      const payload = { query, skip, limit, type, kind, user_token: null }
      const res = await axios.post(
        fstik.api.base + fstik.api.endpoints.search,
        payload,
        { headers: fstik.headers }
      )
      const sets = res.data?.result?.stickerSets
      if (!sets || sets.length === 0) {
        return { success: false, code: 404, result: { error: 'No se encontraron sets' } }
      }
      return { success: true, code: 200, result: sets }
    } catch (err) {
      return { success: false, code: err?.response?.status || 500, result: { error: 'Error buscando stickers', details: err.message } }
    }
  },

  // Obtener más stickers de un set por link Telegram
  more: async (link, skip = 0, limit = 15) => {
    if (!link?.startsWith('https://t.me/addstickers/')) {
      return { success: false, code: 400, result: { error: 'Link de Telegram inválido' } }
    }
    const name = link.split('/addstickers/')[1]?.trim()
    if (!name) {
      return { success: false, code: 400, result: { error: 'No se encontró el nombre del set' } }
    }
    const i = await fstik.name(name)
    if (!i.success) return i
    return await fstik.search({ query: [i.result.id], type: 'more', skip, limit })
  },

  // Busca ya sea por nombre o link
  lookup: async (input) => {
    if (!input || typeof input !== 'string') {
      return { success: false, code: 400, result: { error: 'El input no puede estar vacío' } }
    }
    let name = input.trim()
    if (input.startsWith('https://t.me/addstickers/')) {
      try {
        const url = new URL(name)
        name = url.pathname.replace('/addstickers/', '').trim()
        const direct = await fstik.name(name)
        if (direct.success) return direct
      } catch {
        return { success: false, code: 400, result: { error: 'Link Telegram inválido' } }
      }
    }
    return await fstik.search({ query: name, type: '', kind: 'regular' })
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms))

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply('Por favor ingresa el nombre o link del set de stickers\nEjemplo:\n.fstik pepe\n.fstik https://t.me/addstickers/pepe_memes')

    const query = args.join(' ')
    const isLink = query.startsWith('https://t.me/addstickers/')
    let result

    if (isLink) {
      result = await fstik.more(query)
    } else {
      result = await fstik.lookup(query)
    }

    if (!result.success) return m.reply(result.result.error || 'Error desconocido')

    // Función para enviar info + stickers
    const sendInfo = async (set) => {
      let text = `*INFO SET DE STICKERS*\n\n`
      text += `Nombre: ${set.title}\n`
      text += `ID: ${set.id}\n`
      text += `Nombre corto: ${set.name}\n`
      text += `Descripción: ${set.description || 'Sin descripción'}\n`
      text += `Tags: ${set.tags?.join(', ') || 'Ninguno'}\n`
      text += `Tipo: ${set.kind}\n`
      text += `Categoría: ${set.type}\n`
      text += `Público: ${set.public ? 'Sí' : 'No'}\n`
      text += `Seguro: ${set.safe ? 'Sí' : 'No'}\n`
      text += `Verificado: ${set.verified ? 'Sí' : 'No'}\n`
      text += `Cantidad de stickers: ${set.stickerCount}\n`
      text += `Link: https://t.me/addstickers/${set.name}\n\n`

      // Envía imagen de portada + texto
      await conn.sendMessage(m.chat, {
        image: { url: set.stickers?.[0]?.image_url },
        caption: text
      }, { quoted: m })

      // Envía cada sticker como sticker en WhatsApp
      for (let sticker of set.stickers) {
        if (!sticker.image_url) continue
        await conn.sendMessage(m.chat, { sticker: { url: sticker.image_url } }, { quoted: m })
        await delay(700) // evita flood o errores
      }
    }

    // Si devuelve múltiples sets, toma el primero
    if (Array.isArray(result.result)) {
      await sendInfo(result.result[0])
    } else {
      await sendInfo(result.result)
    }

  } catch (e) {
    m.reply(`Ocurrió un error: ${e.message}`)
  }
}

handler.help = ['fstik']
handler.tags = ['tools']
handler.command = ['fstik', 'stickersearch', 'stickerinfo']

export default handler