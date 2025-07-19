//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command, isOwner }) => {
  if (!isOwner) return m.reply('❌ Solo el owner puede usar este comando.')

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime || !mime.includes('image')) return m.reply(`❌ Responde a una imagen con el comando *${usedPrefix + command}*`)

  let img = await q.download()
  if (!img) return m.reply('❌ No se pudo descargar la imagen.')

  try {
    await conn.updateProfilePicture(conn.user.jid, img)
    m.reply('✅ Foto de perfil actualizada con éxito.')
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al actualizar la foto de perfil.')
  }
}

handler.command = ['setpp']
handler.owner = true
handler.tags = ['owner']
handler.help = ['setpp (responde a imagen)']

export default handler