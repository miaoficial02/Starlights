import axios from 'axios'

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.sendMessage(m.chat, {
    text: `📌 ¿Dónde está el enlace? ¡Sensei despistado!\n\nEjemplo:\n.${command} https://id.pinterest.com/pin/16044142417873989/`
  }, { quoted: m })

  // Reacción inicial
  await conn.sendMessage(m.chat, {
    react: { text: '✨', key: m.key }
  })

  try {
    const res = await pinterestDL(text)
    if (!res.success || !res.media.length) {
      await conn.sendMessage(m.chat, {
        react: { text: '❌', key: m.key }
      })
      return conn.sendMessage(m.chat, {
        text: '😡 ¡No pude obtener la imagen! Tal vez el enlace está mal, intenta de nuevo, maestro.'
      }, { quoted: m })
    }

    const best = res.media[0]
    if (!best.url) throw new Error('¿¡Qué!? ¿¡La imagen desapareció!?')

    const type = best.extension === 'jpg' ? 'image' : 'video'

    // Enviar imagen o video con información
    await conn.sendMessage(m.chat, {
      [type]: { url: best.url },
      caption: `✨ Aquí tienes la mejor calidad que encontré~\n\n🎞️ *Tipo:* ${best.extension.toUpperCase()}\n📁 *Calidad:* ${best.quality || 'por defecto'}\n📦 *Tamaño:* ${best.size ? (best.size / 1024).toFixed(2) + ' KB' : 'Desconocido 🥲'}`
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    })
  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })
    await conn.sendMessage(m.chat, {
      text: '😤 ¡Lo siento! Ocurrió un error molesto. Intenta de nuevo más tarde~'
    }, { quoted: m })
  }
}

handler.help = ['pindl <url>']
handler.tags = ['descargas']
handler.command = ['pindl', 'pinterestdl', 'píndl']

export default handler

// Función para descargar desde Pinterest
async function pinterestDL(url) {
  try {
    if (!url) throw new Error('¿Crees que esto es magia? ¡Pasa la URL primero!')

    const res = await axios.get(`https://pinterestdownloader.io/frontendService/DownloaderService?url=${url}`, {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Origin': 'https://pinterestdownloader.io',
        'Referer': 'https://pinterestdownloader.io/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/130.0.0.0 Safari/537.36'
      }
    })

    const data = res.data
    if (!data?.medias) throw new Error('¿Eh? No encontré ningún medio, qué triste...')

    const originalsSet = new Set()
    const mediaList = []

    for (const media of data.medias) {
      mediaList.push(media)

      // Si es imagen JPG de Pinterest, intenta obtener la versión original
      if (media.extension === 'jpg' && media.url.includes('i.pinimg.com/')) {
        const originalUrl = media.url.replace(/\/\d+x\//, '/originals/')
        if (!originalsSet.has(originalUrl)) {
          originalsSet.add(originalUrl)
          mediaList.push({ ...media, url: originalUrl, quality: 'original' })
        }
      }
    }

    // Ordenar por tamaño (de mayor a menor)
    const sorted = mediaList.sort((a, b) => (b.size || 0) - (a.size || 0))

    return {
      success: true,
      media: sorted
    }
  } catch (e) {
    return { success: false, error: e.message }
  }
}