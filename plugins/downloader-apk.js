let handler = async (m, { conn, args, usedPrefix, command, isOwner}) => {
  if (!args[0]) {
    throw `
📦 *Descarga de aplicación en Roxy_Bot_MD* 🌸

💖 Escribe el nombre de la app que deseas instalar.
✨ Ejemplo:
${usedPrefix + command} Clash Royale

🩵 ¡Suki buscará el paquete más kawaii para ti!`.trim();
}

  let res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${args[0]}`);
  let result = await res.json();

  if (!result ||!result.dllink) {
    throw '❌ No pude encontrar esa app, preciosura~ ¡Intenta con otro nombre más claro! 💫';
}

  let { name, size, lastUpdate, icon} = result;
  let URL = result.dllink;

  let texto = `
꒰📥꒱ *Tu app está siendo preparada por Suki* 🧋

🍡 Nombre: *${name}*
🧁 Tamaño: *${size}*
📆 Última actualización: *${lastUpdate}*

✨ El archivo se descarga de fuentes oficiales con cariño. ¡Instala y disfruta!`.trim();

  await conn.sendFile(m.chat, icon, 'suki-app.jpg', texto, m);

  await conn.sendMessage(m.chat, {
    document: { url: URL},
    mimetype: 'application/vnd.android.package-archive',
    fileName: name + '.apk',
    caption: `📦 *${name}* fue descargada exitosamente 💖\n\n🪄 ¡Tu aventura comienza al instalarla!`,
    contextInfo: {
      mentionedJid: [m.sender],
      isForwarded: true,
      forwardingScore: 999,
      externalAdReply: {
        title: '✨ Roxy_Bot_MD | Descarga de Aplicación',
        body: '¡Archivo APK listo para instalar, preciosura!',
        thumbnailUrl: icon,
        sourceUrl: 'https://whatsapp.com/channel/0029VbApe6jG8l5Nv43dsC2N',
        mediaType: 1,
        renderLargerThumbnail: true
}
}
}, { quoted: m});
};

handler.command = ['apk', 'dapk'];
handler.group = false;
handler.help = ['apk'];
handler.tags = ['descargas'];
export default handler;