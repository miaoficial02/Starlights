export async function before(m, { conn, isAdmin, isBotAdmin, participants }) {
  const regexWaLink = /https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+|https?:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+/gi;

  if (!m.isGroup || m.isBaileys || !regexWaLink.test(m.text)) return;

  const sender = m.sender;

  if (!isBotAdmin) return;

  const groupAdmins = participants.filter(p => p.admin).map(p => p.id);

  // Si el remitente es admin
  if (groupAdmins.includes(sender)) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *AntiLink Activado*\n\n🔒 El mensaje contiene un enlace de WhatsApp pero no puedo eliminarte porque eres administrador.`,
      mentions: [sender]
    }, { quoted: m });
  }

  // Eliminar el mensaje que contiene el link
  try {
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.key.participant || sender
      }
    });
  } catch (e) {
    console.error('❌ Error al borrar el mensaje:', e);
  }

  // Aviso y expulsión
  await conn.sendMessage(m.chat, {
    text: `🚫 *AntiLink Activado*\n\n@${sender.split("@")[0]} fue eliminado por enviar un enlace no permitido.`,
    mentions: [sender]
  });

  await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
}