import fs from 'fs'

let warns = JSON.parse(fs.readFileSync('./data/warns.json'))

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat].antilink) return
  if (isAdmin) return // Ignora si es admin

  const regex = /(https?:\/\/)?(chat\.whatsapp\.com|t\.me\/joinchat|t\.me\/\w+)/i
  if (regex.test(m.text)) {
    await conn.sendMessage(m.chat, { delete: m.key }) // Elimina mensaje

    let id = m.sender
    warns[m.chat] = warns[m.chat] || {}
    warns[m.chat][id] = warns[m.chat][id] || 3
    warns[m.chat][id]--

    fs.writeFileSync('./data/warns.json', JSON.stringify(warns, null, 2))

    if (warns[m.chat][id] <= 0) {
      await conn.groupParticipantsUpdate(m.chat, [id], 'remove') // Expulsa
      delete warns[m.chat][id]
      fs.writeFileSync('./data/warns.json', JSON.stringify(warns, null, 2))
    } else {
      await conn.sendMessage(m.chat, {
        text: `🚫 *Antilink activado*\n@${id.split('@')[0]}, no se permiten links.\n⚠️ Advertencias restantes: *${warns[m.chat][id]}*`,
        mentions: [id]
      })
    }
  }
}