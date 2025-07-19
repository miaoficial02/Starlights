const handler = async (m, { conn, usedPrefix, command }) => {
  const texto = `
🌐 *Grupos Oficiales de NyanCatBot-MD* 🚀

✨ Únete a nuestra comunidad, comparte ideas, reporta errores, o simplemente charla con otros usuarios. ¡Eres bienvenido!

📂 *Lista de grupos:*
1️⃣  *Soporte General*  
https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W

2️⃣  *Comunidad Oficial*  
https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W

3️⃣  *Testers & Beta*  
https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W

⚠️ Respeta las normas de cada grupo. NyanCatBot ama la paz y los arcoíris 🌈

─
📌 Usa *.menu* para ver todos los comandos.
`

  await conn.sendMessage(m.chat, {
    text: texto.trim(),
    contextInfo: {
      externalAdReply: {
        title: "NyanCatBot-MD 🌌",
        body: "Únete a nuestros grupos oficiales",
        thumbnailUrl: 'https://i.imgur.com/f8nq8YF.jpg', // Puedes cambiar la imagen
        sourceUrl: "https://github.com/El-brayan502/NyanCatBot-MD",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = /^grupos$/i

export default handler