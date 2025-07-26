const handler = async (m, { conn, isCreator, command }) => {
  if (!isCreator) return m.reply('🚫 Este comando solo lo puede usar el dueño del bot.')

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
handler.owner = true // Solo el owner puede usarlo

export default handler