let contador = {};

export async function all(m) {
  if (!m.isGroup) return;

  const chatId = m.chat;
  const userId = m.sender;

  if (!contador[chatId]) contador[chatId] = {};
  if (!contador[chatId][userId]) {
    contador[chatId][userId] = {
      mensajes: 0,
      imagenes: 0,
      videos: 0,
      audios: 0,
      stickers: 0,
      encuestas: 0
    };
  }

  const tipo = detectarTipo(m);
  contador[chatId][userId][tipo]++;
}

function detectarTipo(m) {
  const msg = m.message || {};
  if (msg.imageMessage) return 'imagenes';
  if (msg.videoMessage) return 'videos';
  if (msg.audioMessage) return 'audios';
  if (msg.stickerMessage) return 'stickers';
  if (msg.pollCreationMessage) return 'encuestas';
  return 'mensajes';
}

export const handler = {
  command: ['estadisticas'],
  tags: ['grupo'],
  help: ['estadisticas'],
  group: true,

  async handler(m, { conn, participants }) {
    const isAdmin = participants?.some(p => p.id === m.sender && p.admin);
    if (!isAdmin) return m.reply('🚫 Este comando solo puede usarlo un administrador del grupo.');

    const chatId = m.chat;
    if (!contador[chatId]) return m.reply('❌ Aún no hay estadísticas registradas en este grupo.');

    const carga = await m.reply('⏳ Procesando estadísticas...\n[░░░░░░░░░░] 0%');
    const fases = ['10%', '30%', '50%', '70%', '90%', '100%'];
    for (let i = 0; i < fases.length; i++) {
      await new Promise(r => setTimeout(r, 150));
      await conn.sendMessage(m.chat, {
        edit: carga.key,
        text: `⏳ Procesando estadísticas...\n[${'▓'.repeat(i + 1)}${'░'.repeat(10 - i - 1)}] ${fases[i]}`
      });
    }

    const lista = Object.entries(contador[chatId])
      .map(([jid, datos]) => {
        const total = Object.values(datos).reduce((a, b) => a + b, 0);
        return { jid, total, datos };
      })
      .sort((a, b) => b.total - a.total);

    let texto = `📊 *Estadísticas de participación:*\n\n`;

    for (let i = 0; i < lista.length; i++) {
      const { jid, total, datos } = lista[i];
      const nombre = (await conn.getName(jid).catch(() => jid.split('@')[0])) || jid;
      const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹';
      texto += `${medalla} *${nombre}*\n`;
      texto += `   📨 Mensajes: ${datos.mensajes}\n`;
      texto += `   🖼️ Imágenes: ${datos.imagenes}\n`;
      texto += `   📹 Videos: ${datos.videos}\n`;
      texto += `   🎧 Audios: ${datos.audios}\n`;
      texto += `   🔖 Stickers: ${datos.stickers}\n`;
      texto += `   🗳️ Encuestas: ${datos.encuestas}\n`;
      texto += `   📦 Total: ${total}\n\n`;
    }

    await conn.sendMessage(m.chat, {
      edit: carga.key,
      text: texto.trim()
    });
  }
};
