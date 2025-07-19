import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises as fsPromises } from 'fs'
import { join } from 'path'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, __dirname, participants }) => {
  try {
    await m.react('🍓')

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
          sourceUrl: 'https://github.com/El-brayan502/Roxy-MD--Multi-Device/',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

    const body = `
╭───❀˚･ﾟ✧ ʀᴏxʏ ᴍᴅ ᴍᴇɴú ✧ﾟ･˚❀───╮
│ 🍓 *𝘏𝘰𝘭𝘢 𝘦𝘯 𝘲𝘶𝘦 𝘱𝘶𝘦𝘥𝘰 𝘢𝘺𝘶𝘥𝘢𝘳*
│ 🌵 *𝘜𝘴𝘶𝘢𝘳𝘪𝘰* :: *${taguser}*
│ ⏰ *𝘛𝘪𝘦𝘮𝘱𝘰 𝘦𝘯 𝘭𝘪𝘯𝘪𝘢* :: *${uptime}*
│ 🍄 *𝘔𝘪𝘦𝘯𝘣𝘳𝘰𝘴 𝘦𝘯 𝘦𝘭 𝘤𝘩𝘢𝘵* :: *${groupUserCount}*
│ 🍰 *𝘙𝘦𝘨𝘪𝘴𝘵𝘳𝘰* :: ${registered ? '✅ ᴄᴏᴍᴘʟᴇᴛᴀᴅᴏ' : '❌ ɪɴᴄᴏᴍᴘʟᴇᴛᴏ'}
╰─────────────♡─────────────╯

*【𝕷 𝖎 𝖘 𝖙 𝖆 - 𝕯𝖊 - 𝕮 𝖔 𝖒 𝖆 𝖓 𝖉 𝖔 𝖘】*

┏━━ 『 *☆ ᗰᗩIᑎ ᙭ ᖇᘜᑭ ☆* 』 ❃
┃❒  ${usedPrefix}ʀᴇɢ <ɴᴏᴍʙʀᴇ ᴇᴅᴀᴅ>
┃❒  ${usedPrefix}ᴜɴʀᴇɢ
┃❒  ${usedPrefix}ᴍᴇɴᴜ
┃❒  ${usedPrefix}ᴘɪɴɢ
┃❒  ${usedPrefix}ɢʀᴜᴘᴏs
┃❒  ${usedPrefix}ᴏᴡɴᴇʀ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ ᖴᑌᑎ ☆* 』 ❃
┃❒  ${usedPrefix}ɢᴀʏ
┃❒  ${usedPrefix}ᴘᴀᴊᴇᴀᴍᴇ
┃❒  ${usedPrefix}ᴅᴏxᴇᴏ @usuario
┃❒  ${usedPrefix}ᴅᴏxᴜᴇʀ @usuario
┃❒  ${usedPrefix}ғᴏʀᴍᴀʀᴘᴀʀᴇᴊᴀ
┃❒  ${usedPrefix}ғᴏʀᴍᴀʀᴘᴀʀᴇᴊᴀ𝟻
┃❒  ${usedPrefix}ʜᴜᴇᴠᴏ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ áᑎIᗰᗴ ☆* 』 ❃
┃❒  ${usedPrefix}ᴀɴɢʀʏ
┃❒  ${usedPrefix}ʙɪᴛᴇ
┃❒  ${usedPrefix}ʙᴜᴇɴᴀsɴᴏᴄʜᴇs
┃❒  ${usedPrefix}ʙᴜᴇɴᴏsᴅɪ́ᴀs
┃❒  ${usedPrefix}ᴄᴀғᴇ
┃❒  ${usedPrefix}ᴄʀʏ
┃❒  ${usedPrefix}ᴄᴜᴅᴅʟᴇ
┃❒  ${usedPrefix}ʜᴀᴘᴘʏ
┃❒  ${usedPrefix}ʜᴇʟʟᴏ
┃❒  ${usedPrefix}ʟᴏʟɪ
┃❒  ${usedPrefix}ʀᴡ
┃❒  ${usedPrefix}ᴡ
┃❒  ${usedPrefix}ʀᴇᴄʟᴀᴍᴀᴡᴀɪғᴜ
┗━━━━━━━━━━━━━━━━━⪩


┏━━ 『 *☆ ᗪᗴՏᑕᗩᖇᘜáՏ ☆* 』 ❃
┃❒  ${usedPrefix}ᴛɪᴋᴛᴏᴋ
┃❒  ${usedPrefix}ᴘʟᴀʏ
┃❒  ${usedPrefix}ᴘɪɴᴅʟ <link>
┃❒  ${usedPrefix}ɪɴsᴛᴀɢʀᴀᴍ <link>
┃❒  ${usedPrefix}ꜰᴀᴄᴇʙᴏᴏᴋ <link>
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ ᗷᑌՏᑫᑌᗴᗪᗩՏ ☆* 』 ❃
┃❒  ${usedPrefix}ᴀᴘᴛᴏɪᴅᴇ<texto>
┃❒  ${usedPrefix}ᴛɪᴋᴛᴏᴋsᴇᴀʀᴄʜ
┃❒  ${usedPrefix}sꜱᴡᴇʙ
┃❒  ${usedPrefix}sᴘᴏᴛɪꜰʏ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ ᘜᖇᑌᑭO ☆* 』 ❃
┃❒  ${usedPrefix}ɪɴᴠᴏᴄᴀʀ 
┃❒  ${usedPrefix}sᴇᴛᴘᴘɢʀᴜᴘᴏ 
┃❒  ${usedPrefix}ᴋɪᴄᴋ <@tag>
┃❒  ${usedPrefix}ᴛᴀɢ
┃❒  ${usedPrefix}ᴅᴇʟ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ Iᗩ ᙭ ᗩᖇTᗴ ☆* 』 ❃
┃❒  ${usedPrefix}ᴍᴀɢɪᴄsᴛᴜᴅɪᴏ <texto>
┃❒  ${usedPrefix}ᴀɪ <texto>
┃❒  ${usedPrefix}ᴇᴅɪᴛꜰᴏᴛᴏ <descripción>
┃❒  ${usedPrefix}ᴡᴘᴡ
┃❒  ${usedPrefix}ᴘᴏʟʟɪɴᴀᴛɪᴏɴs <texto>
┃❒  ${usedPrefix}ɢᴇᴍɪɴɪ
┃❒  ${usedPrefix}ʙɢʀᴇᴍᴏᴠᴇʀ <imagen>
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ IᑎTᗴᖇᑎᗴT☆* 』 ❃
┃❒  ${usedPrefix}ɴɪᴍᴇɢᴀᴍᴇsᴇᴀʀᴄʜ
┃❒  ${usedPrefix}ᴍᴇɪᴏ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ ᒍᗩᗪIᗷOT ☆* 』 ❃
┃❒  ${usedPrefix}ʙᴏᴛs
┃❒  ${usedPrefix}ᴄᴏᴅᴇ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ Oᗯᑎᗴᖇ ☆* 』 ❃
┃❒  ${usedPrefix}sᴇᴛᴘᴘ <img>
┃❒  ${usedPrefix}ʀᴇsᴛᴀʀᴛ
┃❒  ${usedPrefix}ᴜᴘᴅᴀᴛᴇ
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ ՏTIᑕKᗴᖇ ☆* 』 ❃
┃❒  ${usedPrefix}sᴛɪᴄᴋᴇʀ <img>
┃❒  ${usedPrefix}ʙʀᴀᴛ *<texto>*
┗━━━━━━━━━━━━━━━━━⪩

┏━━ 『 *☆ TOOᒪՏ ☆* 』 ❃
┃❒  ${usedPrefix}ɪǫᴄ <texto>
┃❒  ${usedPrefix}ʀᴠᴏᴄᴀʟ <audio>
┃❒  ${usedPrefix}ᴛᴏᴜʀʟ2
┃❒  ${usedPrefix}ʜᴅ
┃❒  ${usedPrefix}ᴛᴏᴜʀʟ <imagen>
┗━━━━━━━━━━━━━━━━━⪩
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
