let handler = async (m, { conn }) => {
  const start = performance.now();
  await m.reply('🏓 *Probando velocidad...*');
  const end = performance.now();
  const ping = end - start;

  await m.reply(`✅ *RoxyBot está activo*\n📡 *Velocidad:* ${ping.toFixed(2)} ms`);
};

handler.command = ['ping', 'p'];
handler.tags = ['info'];
handler.help = ['ping'];
handler.register = true;

export default handler;