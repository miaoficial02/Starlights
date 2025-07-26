const handler = async (m, { conn, command }) => {
  if (!['573001533523@s.whatsapp.net'].includes(m.sender)) return m.reply('🚫 Este comando solo lo puede usar el dueño del bot.')

  try {
    await conn.chatModify(
      { clear: { message: { id: m.id, fromMe: true } } },
      m.chat,
      []
    )
    await m.reply(`✅ Chat vaciado correctamente.`)
  } catch (e) {
    console.error(e)
    await m.reply('⚠️ No se pudo vaciar el chat. Es posible que no tengas permisos suficientes.')
  }
}

handler.command = ['limpiarchat', 'chadel', 'eliminarchat']

export default handler