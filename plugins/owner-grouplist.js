const handler = async (m, { conn }) => {
  let txt = '';
try {    
  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
  const totalGroups = groups.length;
  for (let i = 0; i < groups.length; i++) {
    const [jid, chat] = groups[i];
    const groupMetadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch((_) => null))) || {};
    const participants = groupMetadata.participants || [];
    const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
    const isBotAdmin = bot?.admin || false;
    const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
    const participantStatus = isParticipant ? '👤 Participante' : '❌ Ex participante';
    const totalParticipants = participants.length;
    txt += `*✰ Grupo ${i + 1}*
    *⭐ 𝐍𝐨𝐦𝐛𝐫𝐞:* ${await conn.getName(jid)}
    *⭐ 𝐈𝐃:* ${jid}
    *⭐ 𝐀𝐝𝐦𝐢𝐧:* ${isBotAdmin ? '✔ Sí' : '❌ No'}
    *⭐ 𝐄𝐬𝐭𝐚𝐝𝐨:* ${participantStatus}
    *⭐ 𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐏𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐧𝐭𝐞𝐬:* ${totalParticipants}
    *⭐ 𝐋𝐢𝐧𝐤:* ${isBotAdmin ? `https://chat.whatsapp.com/${await conn.groupInviteCode(jid) || '--- (Error) ---'}` : '--- (No admin) ---'}\n\n`;
  }
  m.reply(`*𝐋𝐢𝐬𝐭𝐚 𝐝𝐞 𝐠𝐫𝐮𝐩𝐨𝐬 𝐝𝐞𝐥 𝐁𝐨𝐭* ⭐\n\n*—◉ 𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐆𝐫𝐮𝐩𝐨𝐬:* ${totalGroups}\n\n${txt}`.trim());
} catch {
  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
  const totalGroups = groups.length;
  for (let i = 0; i < groups.length; i++) {
    const [jid, chat] = groups[i];
    const groupMetadata = ((conn.chats[jid] || {}).metadata || (await conn.groupMetadata(jid).catch((_) => null))) || {};
    const participants = groupMetadata.participants || [];
    const bot = participants.find((u) => conn.decodeJid(u.id) === conn.user.jid) || {};
    const isBotAdmin = bot?.admin || false;
    const isParticipant = participants.some((u) => conn.decodeJid(u.id) === conn.user.jid);
    const participantStatus = isParticipant ? '👤 Participante' : '❌ Ex participante';
    const totalParticipants = participants.length;    
    txt += `*✰ Grupo ${i + 1}*
    *⭐ 𝐍𝐨𝐦𝐛𝐫𝐞:* ${await conn.getName(jid)}
    *⭐ 𝐈𝐃:* ${jid}
    *⭐ 𝐀𝐝𝐦𝐢𝐧:* ${isBotAdmin ? '✔ Sí' : '❌ No'}
    *⭐ 𝐄𝐬𝐭𝐚𝐝𝐨:* ${participantStatus}
    *⭐ 𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐏𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐧𝐭𝐞𝐬:* ${totalParticipants}
    *⭐ 𝐋𝐢𝐧𝐤:* ${isBotAdmin ? '--- (Error) ---' : '--- (No admin) ---'}\n\n`;
  }
  m.reply(`*𝐋𝐢𝐬𝐭𝐚 𝐝𝐞 𝐆𝐫𝐮𝐩𝐨𝐬 𝐝𝐞𝐥 𝐁𝐨𝐭* ⭐\n\n*—◉ 𝐓𝐨𝐭𝐚𝐥 𝐝𝐞 𝐆𝐫𝐮𝐩𝐨𝐬:* ${totalGroups}\n\n${txt}`.trim());
 }    
};
handler.help = ['groups', 'grouplist'];
handler.tags = ['owner'];
handler.command = ['listgroup', 'gruposlista', 'grouplist', 'listagrupos']
handler.rowner = true;
handler.private = true

export default handler;
