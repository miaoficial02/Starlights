import fetch from 'node-fetch'

let handler = async (m, { conn, command, args }) => {
if (!args[0]) return conn.reply(m.chat, `${emojis} Por favor, ingrese el Link de una página.`, m, fake)
try {
await m.react(rwait)
conn.reply(m.chat, `${emojis} Buscando su información....`, m, fake)
let ss = await (await fetch(`https://image.thum.io/get/fullpage/${args[0]}`)).buffer()
conn.sendFile(m.chat, ss, 'error.png', args[0], fkontak)
await m.react(done)
} catch {
return conn.reply(m.chat, `${msm} Ocurrió un error.`, m, fake)
await m.react(error)}}

handler.help = ['ssweb', 'ss']
handler.tags = ['tools']
handler.command = ['ssweb', 'ss']
handler.register = true

export default handler