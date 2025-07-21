let handler = async (m, { conn, args, usedPrefix, command }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    if (!args[0]) {
      return m.reply(`🍂 *Ingresa el nombre de la aplicación que deseas buscar!*\n\n📍 *Ejemplo: ${usedPrefix + command} TikTok*`)
    }

    const query = args.join(' ')
    const res = await fetch(`https://zenzxz.dpdns.org/search/aptoide?query=${encodeURIComponent(query)}`)
    if (!res.ok) throw '❌ *Error al obtener datos de la API!*'

    const json = await res.json()
    if (!json.status || !json.success || !json.results || json.results.length === 0) {
      throw '🔎 *Aplicación no encontrada, intenta con otra palabra clave.*'
    }

    const apps = json.results.slice(0, 5)
    let texto = `📲 *Resultados de búsqueda en Aptoide:*\n\n`

    for (const app of apps) {
      texto += `🔹 *${app.appName}*\n`
      texto += `*👤 Desarrollador:* ${app.developer?.name || '-'}\n`
      texto += `*📦 Tamaño:* ${app.size}\n`
      texto += `*⭐ Calificación:* ${app.rating}\n`
      texto += `*⬇️ Descargas:* ${app.downloads.toLocaleString()}\n`
      texto += `*🔗 Enlace:* ${app.appUrl}\n\n`
    }

    await conn.sendMessage(m.chat, {
      text: texto.trim(),
      contextInfo: {
        externalAdReply: {
          title: '🔍 Búsqueda en Aptoide',
          body: 'Resultados de aplicaciones encontradas',
          mediaType: 1,
          thumbnailUrl: 'https://files.cloudkuimages.guru/images/nfd0kpBz.jpg',
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: typeof e === 'string' ? e : '❌ *Ocurrió un error al obtener los datos.*',
      quoted: m
    })
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['aptoide']
handler.tags = ['buscador']
handler.command = ['apk', 'aptoide', 'afk']
handler.limit = true
handler.register = true

export default handler