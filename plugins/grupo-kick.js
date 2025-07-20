const handler = async (m, { conn, participants, usedPrefix, command }) => {
  const emoji = '🌸';

  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `
┌──「 *Expulsión Fallida* 」
│ ${emoji} 𝘿𝙚𝙗𝙚𝙨 𝙢𝙚𝙣𝙘𝙞𝙤𝙣𝙖𝙧 𝙖 𝙖𝙡𝙜𝙪𝙞𝙚𝙣 𝙥𝙖𝙧𝙖 𝙚𝙭𝙥𝙪𝙡𝙨𝙖𝙧.
└───────❖`, m, fake)
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  if (user === conn.user.jid) {
    return conn.reply(m.chat, `
┌──「 *Error* 」
│ ❌ 𝙉𝙤 𝙥𝙪𝙚𝙙𝙤 𝙚𝙭𝙥𝙪𝙡𝙨𝙖𝙧𝙢𝙚 𝙖 𝙢𝙞 𝙢𝙞𝙨𝙢𝙖.
└───────❖`, m, fake)
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `
┌──「 *Error* 」
│ 👑 𝙉𝙤 𝙥𝙪𝙚𝙙𝙤 𝙩𝙤𝙘𝙖𝙧 𝙖𝙡 𝙡í𝙙𝙚𝙧 𝙙𝙚𝙡 𝙜𝙧𝙪𝙥𝙤.
└───────❖`, m, fake)
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `
┌──「 *Error* 」
│ 🌟 𝙀𝙨 𝙢𝙞 𝙘𝙧𝙚𝙖𝙙𝙤𝙧, 𝙣𝙤 𝙥𝙪𝙚𝙙𝙤 𝙚𝙭𝙥𝙪𝙡𝙨𝙖𝙧𝙡𝙤.
└───────❖`, m, fake)
  }

  await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
  conn.reply(m.chat, `
╭─❖ 「 *Usuario Expulsado* 」 ❖─
│ ${emoji} 𝙀𝙡 𝙢𝙞𝙚𝙢𝙗𝙧𝙤 𝙛𝙪𝙚 𝙚𝙭𝙥𝙪𝙡𝙨𝙖𝙙𝙤 𝙘𝙤𝙣 𝙪𝙣 *𝙄𝙢𝙥𝙖𝙘𝙩𝙧𝙪𝙚𝙣𝙤*. ⚡
╰─────────────❖`, m, fake)
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.register = true;
handler.botAdmin = true;

export default handler;