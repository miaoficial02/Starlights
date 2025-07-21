import { proto, generateWAMessageContent, generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo está disponible en grupos.')

  const user = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  const username = await conn.getName(user)
  const number = user.split('@')[0]
  const isRegistered = global.db.data.users[user]?.registered ? '✅ Registrado' : '❌ No registrado'

  // Obtener foto de perfil o usar imagen por defecto
  let profilePicUrl
  try {
    profilePicUrl = await conn.profilePictureUrl(user, 'image')
  } catch (e) {
    profilePicUrl = 'https://files.cloudkuimages.guru/images/7kAcwery.jpg' // Imagen por defecto
  }

  const { imageMessage } = await generateWAMessageContent({
    image: { url: profilePicUrl }
  }, { upload: conn.waUploadToServer })

  const card = {
    body: proto.Message.InteractiveMessage.Body.fromObject({
      text: `👤 *Perfil de Usuario*\n\n📛 Nombre: ${username}\n📱 Número: wa.me/${number}\n📝 Registro: ${isRegistered}`
    }),
    footer: proto.Message.InteractiveMessage.Footer.fromObject({
      text: 'Bot: Roxy-MD'
    }),
    header: proto.Message.InteractiveMessage.Header.fromObject({
      hasMediaAttachment: true,
      imageMessage
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
      buttons: [
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '📢 Canal de WhatsApp',
            url: 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '📦 Repositorio del Bot',
            url: 'https://github.com/El-brayan502/RoxyBot-MD'
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🎵 TikTok del Creador',
            url: 'https://www.tiktok.com/@fantom_uwu_330?_t=ZM-8yBpnlcBH7e&_r=1'
          })
        }
      ]
    })
  }

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '✨ Información de perfil'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Sistema de Perfiles • Roxy-MD'
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [card]
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await m.react('👤')
}

handler.help = ['perfil', 'verperfil']
handler.tags = ['info']
handler.command = ['perfil', 'verperfil', 'profile']

export default handler