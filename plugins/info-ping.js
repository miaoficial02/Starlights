let handler = async (m, { conn, usedPrefix }) => {
  const start = performance.now()
  const mensajeTemp = await conn.sendMessage(m.chat, { text: '🏓 Calculando latencia...' }, { quoted: m })
  const end = performance.now()
  const latency = end - start

  let texto = `
╭─────❖ 「 *📶 Estado del Bot* 」 ❖─────
│ 🤖 *Nombre:* NyanCatBot-MD
│ ⚡ *Latencia:* ${latency.toFixed(2)} ms
│ 🟢 *Estado:* Operativo
╰───────────────────────────────╯

🌐 Usa *${usedPrefix}menu* para explorar comandos.
`.trim()

  await conn.sendMessage(m.chat, {
    text: texto,
    footer: '🔰 NyanCatBot-MD | By @El-brayan502',
    buttons: [
      { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🧩 Menú Principal' }, type: 1 },
      { buttonId: `${usedPrefix}grupos`, buttonText: { displayText: '🌐 Grupos Oficiales' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.command = ['ping', 'estado', 'velocidad']
export default handler