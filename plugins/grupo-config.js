const handler = async (m, { conn, command, participants }) => {
  if (!m.isGroup) {
    return m.reply('「⭐」Este comando solo puede usarse en grupos.');
  }

  const botAdmin = await conn.groupMetadata(m.chat).then(res => 
    res.participants.find(p => p.id === conn.user.jid)?.admin
  );

  if (!botAdmin) {
    return m.reply('「⭐」Necesito ser administrador para ejecutar este comando.');
  }

  const action = command === 'open' ? 'not_announcement' : 'announcement';

  await conn.groupSettingUpdate(m.chat, action);

  const msg = command === 'open'
    ? '✅🔓'
    : '✅🔒';

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.command = ['open', 'close'];
handler.tags = ['grupo']
handler.admin = true;
handler.botAdmin = true;

export default handler;
