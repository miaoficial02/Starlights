let handler = async (m, { conn }) => {
  const texto = `✨ *¡Hola guapo!* Soy *𝐇𝐈𝐍𝐀𝐓𝐀-𝐁𝐎𝐓*. ¿Qué deseas hacer hoy? 😉

Desarrollado por 🐉𝙉𝙚𝙤𝙏𝙤𝙆𝙮𝙤 𝘽𝙚𝙖𝙩𝙨🐲 & light Yagami
👑 Owner`
  
  const botones = [
    { buttonId: '.menu', buttonText: { displayText: '📜 Ver Menú' }, type: 1 },
    { buttonId: '.estado', buttonText: { displayText: '📊 Estado Bot' }, type: 1 }
  ]

  const buttonMessage = {
    text: texto,
    footer: '🌸 Hinata-Bot',
    buttons: botones,
    headerType: 1
  }

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

handler.command = /^hinatamenu$/i
export default handler
