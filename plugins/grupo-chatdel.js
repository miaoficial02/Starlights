import fs from 'fs'

let handler = async (m, { conn, command, usedPrefix }) => {
  const chat = m.chat

  // Mensaje de aviso de limpieza
  await conn.sendMessage(chat, { text: '🧹 Limpiando mensajes del bot...' }, { quoted: m })

  try {
    // Descarga el historial del chat (máx 1000 mensajes)
    const history = await conn.fetchMessagesFromWA(chat, 1000)
    let count = 0

    for (let msg of history.messages) {
      // Solo eliminar mensajes que fueron enviados por el bot
      if (msg.key.fromMe && !msg.key.id.startsWith('BAE5')) {
        try {
          await conn.sendMessage(chat, { delete: msg.key })
          count++
        } catch (e) {
          console.log('❌ No se pudo eliminar un mensaje:', e)
        }
      }
    }

    await conn.sendMessage(chat, { text: `✅ Chat limpiado, se eliminaron ${count} mensajes.` })
  } catch (err) {
    console.error(err)
    await conn.sendMessage(chat, { text: '❌ Error al limpiar el chat.' }, { quoted: m })
  }
}

handler.command = /^(limpiarchat|eliminarchat|chadel)$/i
handler.rowner = true // Solo el dueño puede usarlo (puedes cambiarlo a false si quieres)
export default handler