import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises as fsPromises } from 'fs'
import { join } from 'path'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, __dirname, participants }) => {
  try {
    await m.react('✨️')

    let { exp, bank, registered } = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let groupUserCount = m.isGroup ? participants.length : '-'

    let perfil = await conn.profilePictureUrl(conn.user.jid, 'image')
      .catch(() => 'https://files.catbox.moe/9i5o9z.jpg')

    // Preparar el tag del usuario
    const userId = m.sender.split('@')[0]
    let taguser = `@${userId}`
    let phone = PhoneNumber('+' + userId)
    let pais = phone.getRegionCode() || 'Desconocido 🌐'

    const vids = [
      'https://files.cloudkuimages.guru/videos/RhnYWAae.mp4',
      'https://files.cloudkuimages.guru/videos/RhnYWAae.mp4',
      'https://files.cloudkuimages.guru/videos/RhnYWAae.mp4'
    ]
    let videoUrl = vids[Math.floor(Math.random() * vids.length)]

    const header = [
      `╔═━★•°*"'*°•★━═╗`,
      `    ✦ ꧁𝐖𝐞𝐥𝐜𝐨𝐦𝐞꧂ ✦`,
      `╚═━★•°*"'*°•★━═╝`
    ].join('\n')

    const user = global.db.data.users[m.sender] || {};
    const country = user.country || '';
    const isPremium = user.premium || false;


    const channelRD = { 
      id: '120363312092804854@newsletter', 
      name: 'Oficial channel Roxy-MD'
    }


    const metaMsg = {
      quoted: global.fakeMetaMsg,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: '🌸 𝗥𝗢𝗫𝗬 𝗠𝗗 𝗕𝗢𝗧 🌸',
          body: '© 𝑃𝑜𝑤𝑒𝑟𝑒𝑑 𝐵𝑦 𝐷𝑒𝑣𝐵𝑟𝑎𝑦𝑎𝑛',
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: 'https://files.catbox.moe/9i5o9z.jpg',
          sourceUrl: 'https://github.com/El-brayan502/RoxyBot-MD/',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

let saludo
let hora = new Date().getUTCHours() - 6 

if (hora < 0) hora += 24 // por si queda en negativo

if (hora >= 5 && hora < 13) {
  saludo = '🌞 Hola senpai, que tengas un lindo día ✨'
} else if (hora >= 13 && hora < 18) {
  saludo = '🍃 Buenas tardes, senpai 🧸'
} else {
  saludo = '🌙 ¿Por qué aún no duermes, onii-chan? 💤'
}

    const body = `
🎀 Bienvenido a Roxy AI
${saludo}, *${taguser}*!
────────────────
✨ I N F O R M A C I Ó N ✨
· › 🌺 Nombre del Bot: RoxyBot-MD 
· › 👤 Nombre de Usuario: *${taguser}*
· › 🍡 Estado: Gratis
· › 🍒 *Tiempo en línea* :: *${uptime}*
────────────────

*【𝕷 𝖎 𝖘 𝖙 𝖆 - 𝕯𝖊 - 𝕮 𝖔 𝖒 𝖆 𝖓 𝖉 𝖔 𝖘】*

◈───≼ _*MAIN & RPG*_ ≽──⊚
┝⎆ [  ${usedPrefix}ʀᴇɢ <ɴᴏᴍʙʀᴇ ᴇᴅᴀᴅ>
┝⎆ [  ${usedPrefix}ᴜɴʀᴇɢ
┝⎆ [  ${usedPrefix}ᴍᴇɴᴜ
┝⎆ [  ${usedPrefix}ᴊᴜᴇɢᴏs
┝⎆ [  ${usedPrefix}ᴘɪɴɢ
┝⎆ [  ${usedPrefix}ɢʀᴜᴘᴏs
┝⎆ [  ${usedPrefix}ᴏᴡɴᴇʀ
◈┄──━━┉─࿂
◈───≼ _*NSFW*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴘᴇɴᴇᴛʀᴀʀ
┝⎆ [  ${usedPrefix}sᴇxᴏ
┝⎆ [  ${usedPrefix}ᴠɪᴏʟᴀʀ
┝⎆ [  ${usedPrefix}ғᴏʟʟᴀʀ
◈┄──━━┉─࿂
◈───≼ _*FUN*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴛᴏᴘ <text>
┝⎆ [  ${usedPrefix}ɢᴀʏ
┝⎆ [  ${usedPrefix}ᴘᴀᴊᴇᴀᴍᴇ
┝⎆ [  ${usedPrefix}ᴅᴏxᴇᴏ @usuario
┝⎆ [  ${usedPrefix}ᴅᴏxᴜᴇʀ @usuario
┝⎆ [  ${usedPrefix}ғᴏʀᴍᴀʀᴘᴀʀᴇᴊᴀ
┝⎆ [  ${usedPrefix}ғᴏʀᴍᴀʀᴘᴀʀᴇᴊᴀ𝟻
┝⎆ [  ${usedPrefix}ʜᴜᴇᴠᴏ
◈┄──━━┉─࿂

◈───≼ _*ANIME*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴋɪss
┝⎆ [  ${usedPrefix}ᴀɴɢʀʏ
┝⎆ [  ${usedPrefix}ʙɪᴛᴇ
┝⎆ [  ${usedPrefix}ʙᴜᴇɴᴀsɴᴏᴄʜᴇs
┝⎆ [  ${usedPrefix}ʙᴜᴇɴᴏsᴅɪ́ᴀs
┝⎆ [  ${usedPrefix}ᴄᴀғᴇ
┝⎆ [  ${usedPrefix}ᴄʀʏ
┝⎆ [  ${usedPrefix}ᴄᴜᴅᴅʟᴇ
┝⎆ [  ${usedPrefix}ʜᴀᴘᴘʏ
┝⎆ [  ${usedPrefix}ʜᴇʟʟᴏ
┝⎆ [  ${usedPrefix}ʟᴏʟɪ
┝⎆ [  ${usedPrefix}ʀᴡ
┝⎆ [  ${usedPrefix}ᴡ
┝⎆ [  ${usedPrefix}ʀᴇᴄʟᴀᴍᴀᴡᴀɪғᴜ
┗━━━━━━━━━━━━━━━━━⪩


◈───≼ _*DESCARGAS*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴛɪᴋᴛᴏᴋ
┝⎆ [  ${usedPrefix}ᴘʟᴀʏ
┝⎆ [  ${usedPrefix}ᴘɪɴᴅʟ <link>
┝⎆ [  ${usedPrefix}ɪɴsᴛᴀɢʀᴀᴍ <link>
┝⎆ [  ${usedPrefix}ꜰᴀᴄᴇʙᴏᴏᴋ <link>
◈┄──━━┉─࿂

◈───≼ _*BUSCADORES*_ ≽──⊚
┝⎆ [  ${usedPrefix}ʏᴛs
┝⎆ [  ${usedPrefix}ᴘɪɴᴛᴇʀᴇsᴛ
┝⎆ [  ${usedPrefix}ᴀᴘᴛᴏɪᴅᴇ<texto>
┝⎆ [  ${usedPrefix}ᴛɪᴋᴛᴏᴋsᴇᴀʀᴄʜ
┝⎆ [  ${usedPrefix}sꜱᴡᴇʙ
┝⎆ [  ${usedPrefix}sᴘᴏᴛɪꜰʏ
◈┄──━━┉─࿂
◈───≼ _*GRUPO*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴛᴀɢᴛᴇxᴛ
┝⎆ [  ${usedPrefix}ᴀᴅᴠᴇʀᴛᴇɴᴄɪᴀ <@tag> <text>
┝⎆ [  ${usedPrefix}ᴘᴇʀғɪʟ
┝⎆ [  ${usedPrefix}ɢʀᴜᴘᴏᴄᴇʀʀᴀʀ
┝⎆ [  ${usedPrefix}ɢʀᴜᴘᴏᴀʙʀɪʀ
┝⎆ [  ${usedPrefix}ɪɴᴠᴏᴄᴀʀ 
┝⎆ [  ${usedPrefix}sᴇᴛᴘᴘɢʀᴜᴘᴏ 
┝⎆ [  ${usedPrefix}ᴋɪᴄᴋ <@tag>
┝⎆ [  ${usedPrefix}ᴛᴀɢ
┝⎆ [  ${usedPrefix}ᴅᴇʟ
◈┄──━━┉─࿂

◈───≼ _*IA & ARTE*_ ≽──⊚
┝⎆ [  ${usedPrefix}ᴍᴀɢɪᴄsᴛᴜᴅɪᴏ <texto>
┝⎆ [  ${usedPrefix}ᴀɪ <texto>
┝⎆ [  ${usedPrefix}ᴇᴅɪᴛꜰᴏᴛᴏ <descripción>
┝⎆ [  ${usedPrefix}ᴡᴘᴡ
┝⎆ [  ${usedPrefix}ᴘᴏʟʟɪɴᴀᴛɪᴏɴs <texto>
┝⎆ [  ${usedPrefix}ɢᴇᴍɪɴɪ
┝⎆ [  ${usedPrefix}ʙɢʀᴇᴍᴏᴠᴇʀ <imagen>
◈┄──━━┉─࿂

◈───≼ _*INTERNET*_ ≽──⊚
┝⎆ [  ${usedPrefix}ɴɪᴍᴇɢᴀᴍᴇsᴇᴀʀᴄʜ
┝⎆ [  ${usedPrefix}ᴍᴇɪᴏ
◈┄──━━┉─࿂

◈───≼ _*JADIBOT*_ ≽──⊚
┝⎆ [  ${usedPrefix}ʙᴏᴛs
┝⎆ [  ${usedPrefix}ᴄᴏᴅᴇ
◈┄──━━┉─࿂

◈───≼ _*OWNER*_ ≽──⊚
┝⎆ [  ${usedPrefix}ʀᴇɪɴɪᴄɪᴀʀ
┝⎆ [  ${usedPrefix}ᴅsᴏᴡɴᴇʀ
┝⎆ [  ${usedPrefix}sᴇᴛɴᴀᴍᴇ
┝⎆ [  ${usedPrefix}sᴇᴛᴘᴘ <img>
┝⎆ [  ${usedPrefix}ʀᴇsᴛᴀʀᴛ
┝⎆ [  ${usedPrefix}ᴜᴘᴅᴀᴛᴇ
◈┄──━━┉─࿂

◈───≼ _*STICKER*_ ≽──⊚
┝⎆ [  ${usedPrefix}sᴛɪᴄᴋᴇʀ <img>
┝⎆ [  ${usedPrefix}ʙʀᴀᴛ *<texto>*
◈┄──━━┉─࿂

◈───≼ _*TOOLS*_ ≽──⊚
┝⎆ [  ${usedPrefix}ɪǫᴄ <texto>
┝⎆ [  ${usedPrefix}ʀᴠᴏᴄᴀʟ <audio>
┝⎆ [  ${usedPrefix}ᴛᴏᴜʀʟ2
┝⎆ [  ${usedPrefix}ʜᴅ
┝⎆ [  ${usedPrefix}ᴛᴏᴜʀʟ <imagen>
◈┄──━━┉─࿂
`.trim()

    // Unir header + body
    const menu = `${header}\n${body}`

    // Configurar datos para el mensaje
    const botname = '🌸◌*̥₊ Rᴏxʏ-Mᴅ ◌❐🎋༉'
    const textbot = '💖 𝙍𝙊𝙓𝙔 𝘽𝙔 𝘿𝙀𝙑 𝘽𝙍𝘼𝙔𝘼𝙉 ✨️'
    const banner = perfil
    const redes = 'https://whatsapp.com/channel/0029VajUPbECxoB0cYovo60W'
    
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: body,
      gifPlayback: true,
      mentions: [m.sender],  // Agregamos el array de menciones
      ...metaMsg
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `✘ Error al enviar el menú: ${e.message}`,
      mentions: [m.sender]  // También incluimos menciones en el mensaje de error
    }, { 
      quoted: metaMsg 
    })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu','help','menú','allmenu','menucompleto']
handler.register = true
export default handler

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
