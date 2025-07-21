import fs from 'fs'

let handler = async (m, { conn, text, command, isOwner }) => {
  if (!isOwner) return m.reply('🚫 Solo el creador del bot puede usar este comando.')
  if (!text) return m.reply(`📛 Ejemplo de uso:\n.setname MiBotRoxy`)

  try {
    await conn.updateProfileName(text.trim())
    m.reply(`✅ Nombre del bot actualizado correctamente a: *${text}*`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al cambiar el nombre del bot.')
  }
}

handler.command = ['setname', 'cambiarnombre']
handler.owner = true
handler.register = true
handler.help = ['setname <nuevo_nombre>']
handler.tags = ['owner']

export default handler