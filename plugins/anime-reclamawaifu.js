//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import axios from 'axios'

let handler = async (m, { conn }) => {
  // Obtener imagen random desde waifu.pics
  let res = await axios.get('https://api.waifu.pics/sfw/waifu')
  let image = res.data.url

  // Mensaje de respuesta
  let texto = `
🥳 𝚁𝚎𝚌𝚕𝚊𝚖𝚊𝚜𝚝𝚎 𝚝𝚞 𝚠𝚊𝚒𝚏𝚞 𝚌𝚘𝚗 é𝚡𝚒𝚝𝚘.
💖 𝙳𝚒𝚜𝚏𝚛ú𝚝𝚊𝚕𝚊 y cuídala bien.
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: image },
    caption: texto
  }, { quoted: m })
}

handler.command = ['reclamawaifu', 'waifu']
handler.help = ['randompic']
handler.tags = ['anime']

export default handler