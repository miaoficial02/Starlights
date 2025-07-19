let handler = async (m, { conn, args, usedPrefix, command }) => {
  await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

  try {
    if (args.length < 3) {
      throw `*⚠️ ¡Formato incorrecto!*\n\n*Usa así:*\n\n*${usedPrefix + command} <nombre> <avatar_url> <número>*\n\n*Ejemplo:*\n*${usedPrefix + command} Lznycx https://files.cloudkuimages.guru/images/9qjkxdan.jpg 100*`
    }

    const [nombre, avatar, numero] = args

    const url = `https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(nombre)}&avatar=${encodeURIComponent(avatar)}&num=${encodeURIComponent(numero)}`
    const res = await fetch(url)
    if (!res.ok) throw '*❌ Error al generar la imagen. Verifica los parámetros.*'

    const buffer = await res.arrayBuffer()
    await conn.sendMessage(m.chat, {
      image: Buffer.from(buffer),
      caption: `🌈 *GENERADOR DE PORCENTAJE GAY*\n\n👤 *Nombre: ${nombre}*\n🖼️ *Avatar: [desde URL]*\n📊 *Porcentaje: ${numero}%*`,
      quoted: m
    })
  } catch (err) {
    await conn.sendMessage(m.chat, {
      text: typeof err === 'string' ? err : '*❌ Ocurrió un error inesperado.*',
      quoted: m
    })
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } })
  }
}

handler.help = ['gay']
handler.tags = ['maker', 'diversión']
handler.command = /^gay$/i
handler.limit = true
handler.register = true

export default handler