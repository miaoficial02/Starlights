const handler = async (m, { conn, text, usedPrefix, command, participants, groupMetadata, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return m.reply('✦ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('✦ Solo los administradores pueden usar este comando.')

  const user = m.mentionedJid?.[0]
  const mensaje = text.split(" ").slice(1).join(" ")

  if (!user) return m.reply(`✦ Debes mencionar a alguien.\nEjemplo: *${usedPrefix}${command} @usuario razón*`)
  if (!mensaje) return m.reply('✦ Debes escribir el motivo de la advertencia.')

  const date = new Date().toLocaleDateString('es-ES')
  const groupName = groupMetadata.subject
  const senderName = await conn.getName(m.sender)

  const advertenciaTexto = `⚠️ *ADVERTENCIA RECIBIDA* ⚠️

🔰 *Grupo:* ${groupName}
👮‍♂️ *Moderador:* ${senderName}
📅 *Fecha:* ${date}

📝 *Mensaje:*
${mensaje}

❗Por favor, evita futuras faltas.`

  const imagen = 'https://files.cloudkuimages.guru/images/7kAcwery.jpg' // Imagen personalizada

  const preview = {
    contextInfo: {
      externalAdReply: {
        title: '⚠️ Advertencia oficial',
        body: 'Has recibido una advertencia del grupo',
        thumbnailUrl: imagen,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false,
        sourceUrl: 'https://whatsapp.com' // Puedes poner un link personalizado si quieres
      }
    }
  }

  try {
    await conn.sendMessage(user, { text: advertenciaTexto }, { quoted: m, ...preview })
    await m.reply('✅ Advertencia enviada por privado correctamente.')
  } catch (e) {
    await m.reply('❌ No se pudo enviar la advertencia. Es posible que el usuario no tenga el chat abierto con el bot.')
  }
}

handler.command = ['advertencia', 'ad', 'daradvertencia']
handler.tags = ['grupo']
handler.group = true
handler.admin = true

export default handler