//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    // API pública para waifus random
    const res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw new Error('Error al obtener la waifu')

    const json = await res.json()
    const imageUrl = json.url

    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: 'Aquí tienes tu waifu 💖' }, { quoted: m })

  } catch (e) {
    m.reply('❌ Error al obtener la waifu: ' + e.message)
  }
}

handler.command = ['w']
export default handler