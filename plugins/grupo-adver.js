const warnings = global.db.data.warnings = global.db.data.warnings || {}
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command, participants, isAdmin, isGroup, isBotAdmin }) => {
  if (!isGroup) return m.reply('❗ Este comando solo funciona en grupos.')
  if (!isAdmin) return m.reply('🚫 Solo los administradores pueden usar este comando.')

  let user = m.mentionedJid?.[0] || (args[0]?.includes('@') ? args[0].replace(/[@+]/g, '') + '@s.whatsapp.net' : null)
  if (!user) return m.reply(`⚠️ Debes mencionar al usuario o escribir su número.\n\nEjemplo:\n${usedPrefix + command} @usuario`)

  warnings[user] = warnings[user] || { count: 0 }
  warnings[user].count++

  let profile
  try {
    profile = await conn.profilePictureUrl(user, 'image')
  } catch (e) {
    profile = 'https://files.cloudkuimages.guru/images/7kAcwery.jpg'
  }

  let name = await conn.getName(user)
  let warnCount = warnings[user].count

  let advertText = `🚫 *ADVERTENCIA EMITIDA*\n\n👤 Usuario: @${user.split('@')[0]}\n📄 Nombre: ${name}\n⚠️ Advertencias: ${warnCount}/3\n\n✳️ Evita romper las reglas del grupo o podrías ser sancionado.`

  // Enviar advertencia por privado
  await conn.sendMessage(user, {
    image: { url: profile },
    caption: advertText,
    mentions: [user]
  })

  // Avisar en grupo que se envió la advertencia
  await conn.sendMessage(m.chat, {
    text: `📩 Se ha enviado una advertencia por privado a @${user.split('@')[0]}`,
    mentions: [user]
  }, { quoted: m })

  if (warnCount >= 3) {
    await conn.sendMessage(m.chat, {
      text: `🚷 *@${user.split('@')[0]} ha recibido 3 advertencias.*\nPuedes decidir si expulsarlo.`,
      mentions: [user]
    }, { quoted: m })
  }
}

handler.command = ['daradvertencia', 'advertencia', 'ad']
handler.group = true
handler.admin = true
handler.register = true

export default handler