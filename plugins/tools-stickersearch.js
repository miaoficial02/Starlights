import axios from 'axios'

const fstik = {
  api: {
    base: 'https://api.fstik.app',
    endpoints: {
      direct: '/getStickerSetByName',  // Obtener set de stickers por nombre
      search: '/searchStickerSet'      // Buscar sets de stickers
    }
  },

  headers: {
    accept: 'application/json, text/plain, */*',
    'content-type': 'application/json',
    origin: 'https://webapp.fstik.app',
    referer: 'https://webapp.fstik.app/',
    'user-agent': 'NB Android/1.0.0'
  },

  // Función para obtener info de un set por nombre
  name: async (name) => {
    if (!name || typeof name !== 'string') {
      return {
        success: false,
        code: 400,
        result: { error: 'La entrada no puede estar vacía, bro 🗿' }
      }
    }

    try {
      const res = await axios.post(
        fstik.api.base + fstik.api.endpoints.direct,
        { name, user_token: null },
        { headers: fstik.headers }
      )

      const set = res.data?.result
      if (!set) {
        return {
          success: false,
          code: 404,
          result: { error: `El set de stickers "${name}" no existe, bro... 🤙🏻` }
        }
      }

      return {
        success: true,
        code: 200,
        result: {
          source: 'database',
          id: set.id,
          title: set.title,
          name: set.name,
          description: set.description,
          tags: set.tags,
          kind: set.kind,
          type: set.type,
          public: set.public,
          safe: set.safe,
          verified: set.verified,
          reaction: set.reaction,
          installations: set.installations,
          stickerCount: set.stickers?.length || 0,
          stickers: set.stickers?.map((s, i) => {
            const file_id = s.file_id ?? s.fileid
            const thumb_id = s.thumb?.file_id ?? s.thumb?.fileid
            return {
              index: i + 1,
              file_id,
              thumb_id,
              size: `${s.width}x${s.height}`,
              image_url: thumb_id ? `${fstik.api.base}/file/${thumb_id}/sticker.webp` : null
            }
          })
        }
      }
    } catch (err) {
      return {
        success: false,
        code: err?.response?.status || 500,
        result: {
          error: 'Error, bro 🫵🏻😂',
          details: err.message
        }
      }
    }
  },

  // Función para buscar sets de stickers con filtros
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
        return {
          success: false,
          code: 404,
          result: { error: 'No se encontraron sets de stickers, bro.. intenta más tarde 😂🫵🏻' }
        }
      }

      return {
        success: true,
        code: 200,
        result: sets.map((set, i) => ({
          index: i + skip + 1,
          id: set.id,
          name: set.name,
          title: set.title,
          description: set.description,
          tags: set.tags,
          kind: set.kind,
          type: set.type,
          public: set.public,
          safe: set.safe,
          verified: set.verified,
          reaction: set.reaction,
          installations: set.installations,
          stickerCount: set.stickers?.length || 0,
          stickers: set.stickers?.map((s, j) => {
            const file_id = s.file_id ?? s.fileid
            const thumb_id = s.thumb?.file_id ?? s.thumb?.fileid
            return {
              index: j + 1,
              file_id,
              thumb_id,
              size: `${s.width}x${s.height}`,
              image_url: thumb_id ? `${fstik.api.base}/file/${thumb_id}/sticker.webp` : null
            }
          })
        }))
      }
    } catch (err) {
      return {
        success: false,
        code: err?.response?.status || 500,
        result: {
          error: 'No se pudo buscar el sticker, bro.. 🤙🏻',
          details: err.message
        }
      }
    }
  },

  // Función para obtener más stickers a partir de un link de Telegram
  more: async (link, skip = 0, limit = 15) => {
    if (!link?.startsWith('https://t.me/addstickers/')) {
      return {
        success: false,
        code: 400,
        result: { error: 'El link de Telegram no es válido, bro 🗿' }
      }
    }

    const name = link.split('/addstickers/')[1]?.trim()
    if (!name) {
      return {
        success: false,
        code: 400,
        result: { error: 'Eh, no tiene nombre el set de stickers 😏' }
      }
    }

    const i = await fstik.name(name)
    if (!i.success) return i

    return await fstik.search({
      query: [i.result.id],
      type: 'more',
      skip,
      limit
    })
  },

  // Función para buscar ya sea por nombre o link
  lookup: async (input) => {
    if (!input || typeof input !== 'string') {
      return {
        success: false,
        code: 400,
        result: { error: 'La entrada no puede estar vacía, bro 🗿' }
      }
    }

    let name = input.trim()
    const isLink = input.startsWith('https://t.me/addstickers/')
    if (isLink) {
      try {
        const url = new URL(name)
        name = url.pathname.replace('/addstickers/', '').trim()
        const direct = await fstik.name(name)
        if (direct.success) return direct
      } catch {
        return {
          success: false,
          code: 400,
          result: { error: 'El link de Telegram no es válido, bro...' }
        }
      }
    }

    return await fstik.search({
      query: name,
      type: '',
      kind: 'regular'
    })
  },

  // Función para manejar peticiones según modo
  request: async (query, mode = '', options = {}) => {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        code: 400,
        result: { error: 'La entrada no puede estar vacía, bro 🗿' }
      }
    }

    const input = query.trim()

    switch (mode) {
      case 'lookup':
        return await fstik.lookup(input)

      case 'more':
        return await fstik.more(input, options.skip || 0, options.limit || 15)

      case 'name':
        return await fstik.name(input)

      case 'search':
      case '':
        return await fstik.search({
          query: input,
          skip: options.skip || 0,
          limit: options.limit || 15,
          type: options.type || '',
          kind: options.kind || 'regular'
        })

      default:
        return {
          success: false,
          code: 400,
          result: { error: `El modo "${mode}" no es válido, bro...` }
        }
    }
  }
}

let handler = async (m, { conn, args, command }) => {
  try {
    if (!args[0]) return m.reply('Introduce una consulta de búsqueda o link de sticker de Telegram\n\nEjemplo :\n.fstik gato\n.fstik https://t.me/addstickers/pepe_memes')

    const query = args.join(' ')
    const isLink = query.startsWith('https://t.me/addstickers/')

    let result
    if (isLink) {
      result = await fstik.more(query)
    } else {
      result = await fstik.lookup(query)
    }

    if (!result.success) {
      return m.reply(result.result.error || 'Error bro :v')
    }

    const sendInfo = async (set) => {
      let text = `INFO DEL SET DE STICKERS\n\n`
      text += `Nombre : ${set.title}\n`
      text += `ID : ${set.id}\n`
      text += `Nombre Set : ${set.name}\n`
      text += `Descripción : ${set.description || 'Sin descripción'}\n`
      text += `Tags : ${set.tags?.join(', ') || 'Sin tags'}\n`
      text += `Tipo : ${set.kind}\n`
      text += `Categoría : ${set.type}\n`
      text += `Público : ${set.public ? 'Sí' : 'No'}\n`
      text += `Seguro : ${set.safe ? 'Sí' : 'No'}\n`
      text += `Verificado : ${set.verified ? 'Sí' : 'No'}\n`
      text += `Cantidad de Stickers : ${set.stickerCount}\n`
      text += `Link : https://t.me/addstickers/${set.name}\

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