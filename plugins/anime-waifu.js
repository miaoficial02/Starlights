import axios from 'axios'

let handler = async (m, { conn }) => {
  // Obtener imagen random de Waifu.pics
  const res = await axios.get('https://api.waifu.pics/sfw/waifu')
  const image = res.data.url

  // Mensaje de respuesta
  const texto = `
🎉 ¡Reclamaste tu waifu con éxito!

💌 Disfrútala y cuídala mucho.
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: image },
    caption: texto
  }, { quoted: m })
}

handler.command = ['rw', 'waifurequest']
export default handler