const handler = async (m, { conn, isAdmin, isBotAdmin, command }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')
  if (!isBotAdmin) return m.reply('🤖 Necesito ser administrador para cambiar la configuración del grupo.')

  const abrir = ['abrir', 'grupoabrir'].includes(command)
  const cerrar = ['cerrar', 'grupocerrar'].includes(command)

  if (abrir) {
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    return m.reply('🔓 *El grupo ha sido abierto.*\nAhora todos pueden enviar mensajes.')
  }

  if (cerrar) {
    await conn.groupSettingUpdate(m.chat, 'announcement')
    return m.reply('🔒 *El grupo ha sido cerrado.*\nSolo los administradores pueden enviar mensajes.')
  }

  m.reply('⚠️ Comando no reconocido.')
}

handler.help = ['abrir', 'cerrar', 'grupoabrir', 'grupocerrar']
handler.tags = ['grupo']
handler.command = ['abrir', 'cerrar', 'grupoabrir', 'grupocerrar']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler