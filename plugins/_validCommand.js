export async function before(m) {
if (!m.text || !global.prefix.test(m.text)) {
return
}
const usedPrefix = global.prefix.exec(m.text)[0]
const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
const validCommand = (command, plugins) => {
for (let plugin of Object.values(plugins)) {
if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
return true
}}
return false
}
if (!command) return
if (command === "bot") {
return
}
if (validCommand(command, global.plugins)) {
let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]    
if (chat.isBanned) {
const avisoDesactivado = `《⭐》El bot *${botname}* está desactivado en este grupo.\n\n> ⚠️ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`
await m.reply(avisoDesactivado)
return
}    
if (!user.commands) {
user.commands = 0
}
user.commands += 1
} else {
const comando = m.text.trim().split(' ')[0]
  await conn.sendMessage(m.chat, { text: `╭━━⊱ ❌ 𝗘𝗦𝗧𝗘 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 𝗡𝗢 𝗘𝗫𝗜𝗦𝗧𝗘 ❌ ⊱━━╮\n┃ 💬 𝗛𝗼𝗹𝗮: @${m.sender.split("@")[0]}\n┃ 📌 𝗨𝘀𝗮: *#help*\n┃ 🧾 𝗣𝗮𝗿𝗮 𝘃𝗲𝗿 𝗹𝗼𝘀 𝗰𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝗱𝗶𝘀𝗽𝗼𝗻𝗶𝗯𝗹𝗲𝘀\n╰━━━━━━━━━━━━━━━━━╯`, mentions: [m.sender] }, { quoted: m });
//await m.reply(`《⭐》Hola Amigo el comando *${comando}* no existe.\nPuedes ver mi lista de comandos disponibles usando:\n» *#help*`)

