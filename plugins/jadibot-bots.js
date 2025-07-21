import ws from 'ws'
import fetch from 'node-fetch'

async function handler(m, { conn: _envio, usedPrefix }) {
  const uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid.replace(/[^0-9]/g, ''), conn.user)
    }
  })

  const message = Array.from(uniqueUsers.values()).map((user, index) => `
╭───♡⃛ BOT #${index + 1}
│ 🌷 Usuario: @${user.jid.replace(/[^0-9]/g, '')}
│ 💌 Link: wa.me/${user.jid.replace(/[^0-9]/g, '')}
│ 🧁 Nombre: ${user.name || 'Roxy-MD 💖'}
╰───────────────`).join('\n')

  const replyMessage = message.length === 0
    ? '🌸 No hay bots activos en este momento...'
    : message

  const responseMessage = `🎀 𓂃 ʀᴏxʏ-ᴍᴅ 𝒋𝒂𝒅𝒊𝒃𝒐𝒕𝒔 𝒂𝒄𝒕𝒊𝒗𝒐𝒔 💖\n\n${replyMessage}`

  let img = await (await fetch(`https://files.cloudkuimages.guru/images/71uq3UlE.jpg`)).buffer()

  await _envio.sendFile(m.chat, img, 'roxy-jadibots.jpg', responseMessage, m, false, {
    mentions: _envio.parseMention(responseMessage)
  })
}

handler.command = ['listjadibot', 'bots']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler