import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) return m.reply(`🌸 *Ingresa el nombre o link del video*\n\n✨ Ejemplo:\n${usedPrefix + command} Un verano sin ti`)

    let videoIdToFind = text.match(youtubeRegexID)
    let search = await yts(videoIdToFind ? 'https://youtu.be/' + videoIdToFind[1] : text)

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      search = search.all.find(v => v.videoId === videoId) || search.videos.find(v => v.videoId === videoId)
    } else {
      search = search.videos[0]
    }

    if (!search) return m.reply('❌ No se encontró ningún resultado.')

    let { title, thumbnail, timestamp, views, ago, url, author } = search
    const vistas = formatViews(views)
    const canal = author?.name || 'Desconocido'

    const infoMsg = `💖 *${title}*\n\n` +
      `🎤 *Canal:* ${canal}\n` +
      `📊 *Vistas:* ${vistas}\n` +
      `⏱️ *Duración:* ${timestamp || 'Desconocida'}\n` +
      `🗓️ *Publicado:* ${ago}\n` +
      `🔗 *Link:* ${url}`

    const thumb = (await conn.getFile(thumbnail))?.data || null

    const ad = {
      contextInfo: {
        externalAdReply: {
          title: '🎧 RoxiMD Downloader ♪',
          body: canal,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: 'https://theadonix-api.vercel.app',
          thumbnail: thumb,
          renderLargerThumbnail: true
        }
      }
    }

    await conn.sendMessage(m.chat, { text: infoMsg }, { quoted: m, ...ad })

    try {
      const r = await fetch(`https://theadonix-api.vercel.app/api/ytmp3?url=${encodeURIComponent(url)}`)
      const json = await r.json()
      if (!json?.result?.audio) throw new Error('No se pudo obtener el audio.')

      await conn.sendMessage(m.chat, {
        audio: { url: json.result.audio },
        mimetype: 'audio/mpeg',
        fileName: json.result.filename || `${json.result.title}.mp3`,
        ptt: true
      }, { quoted: m })

    } catch (err) {
      return m.reply('❌ Error al enviar el audio. Puede que el video sea muy pesado.')
    }

  } catch (err) {
    console.error(err)
    return m.reply(`⚠️ *Ocurrió un error:* ${err.message}`)
  }
}

handler.command = ['play'] // puedes agregar alias como 'yta' si deseas
handler.help = ['play'].map(v => v + ' <texto|url>')
handler.tags = ['downloader']
handler.register = false
handler.limit = 1

export default handler

function formatViews(views) {
  if (!views) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`
  return views.toString()
}