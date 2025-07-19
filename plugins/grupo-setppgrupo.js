//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.')
  if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.')
  if (!isBotAdmin) return m.reply('❌ El bot debe ser administrador para cambiar la foto del grupo.')

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) return m.reply(`📸 Responde a una imagen con el comando *${usedPrefix + command}*`)

  try {
    let img = await q.download()
    await conn.updateProfilePicture(m.chat, img)
    m.reply('✅ Foto del grupo actualizada con éxito.')
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al actualizar la foto del grupo.')
  }
}

handler.command = ['setppgrupo', 'setppgroup']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.tags = ['group']
handler.help = ['setppgrupo (responde a imagen)']

export default handler