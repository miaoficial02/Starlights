//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply('*📝 Escribe un texto para chatear con RoxyAI!*\n*Ejemplo:* .riple Hola, ¿cómo estás?');
  }

  try {
    await conn.reply(m.chat, '🔄 Procesando tu mensaje, espera un momento...', m);

    const apiUrl = `https://api.nekorinn.my.id/ai/ripleai?text=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`*❌ Error al procesar la solicitud* (Código: ${response.status})`);

    const data = await response.json();
    if (!data?.status || !data?.result) throw new Error('*❌ No se recibió una respuesta válida*');

    await conn.reply(m.chat, `*🤖 RoxyAI dice:*\n${data.result}\n\n*📝 Tu mensaje:* ${text}`, m);
    
  } catch (e) {
    console.error(e);
    m.reply('*❌ Error al conectar con RoxyAI: ' + e.message + '*');
  }
};

handler.help = ['ia'];
handler.command = ['roxy', 'roxiai', 'iaroxy']
handler.tags = ['ai'];
handler.limit = true;
handler.register = true;

export default handler;