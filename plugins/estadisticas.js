import fs from 'fs';

const PATH = './database/estadisticas.json';
let db = fs.existsSync(PATH) ? JSON.parse(fs.readFileSync(PATH)) : {};

function saveDB() {
  fs.writeFileSync(PATH, JSON.stringify(db, null, 2));
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

export async function all(m) {
  if (!m.isGroup) return;

  const grupo = m.chat;
  const usuario = m.sender;

  if (!db[grupo]) db[grupo] = {};
  if (!db[grupo][usuario]) {
    db[grupo][usuario] = {
      mensajes: 0,
      imagenes: 0,
      videos: 0,
      audios: 0,
      stickers: 0,
      encuestas: 0
    };
  }

  const tipo = detectarTipo(m);
  if (db[grupo][usuario][tipo] != null) {
    db[grupo][usuario][tipo]++;
    saveDB();
  }
}

export const handler = {
  command: ['estadisticas'],
  tags: ['grupo'],
  help: ['estadisticas'],
  group: true,

  async handler(m, { conn, participants }) {
    const isAdmin = participants?.some(p => p.id === m.sender && p.admin);
    if (!isAdmin) return m.reply('🚫 Este comando solo puede ser usado por *administradores del grupo*.');

    const grupo = m.chat;
    if (!db[grupo]) return m.reply('📉 No hay datos registrados en este grupo.');

    const carga = await m.reply('⏳ Procesando estadísticas...\n[░░░░░░░░░░] 0%');
    const fases = ['10%', '30%', '50%', '70%', '90%', '100%'];
    for (let i = 0; i < fases.length; i++) {
      await new Promise(r => setTimeout(r, 150));
      await conn.sendMessage(m.chat, {
        edit: carga.key,
        text: `⏳ Procesando estadísticas...\n[${'▓'.repeat(i + 1)}${'░'.repeat(10 - (i + 1))}] ${fases[i]}`
      });
    }

    const lista = Object.entries(db[grupo])
      .map(([jid, data]) => {
        const total = Object.values(data).reduce((a, b) => a + b, 0);
        return { jid, total, ...data };
      })
      .sort((a, b) => b.total - a.total);

    let texto = `📊 *Estadísticas de participación del grupo:*\n\n`;

    for (let i = 0; i < lista.length; i++) {
      const u = lista[i];
      const nombre = (await conn.getName(u.jid).catch(() => u.jid.split('@')[0])) || u.jid;
      const medalla = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🔹';

      texto += `${medalla} *${nombre}*\n`;
      texto += `   📨 Mensajes: ${u.mensajes || 0}\n`;
      texto += `   🖼️ Imágenes: ${u.imagenes || 0}\n`;
      texto += `   📹 Videos: ${u.videos || 0}\n`;
      texto += `   🎧 Audios: ${u.audios || 0}\n`;
      texto += `   🔖 Stickers: ${u.stickers || 0}\n`;
      texto += `   🗳️ Encuestas: ${u.encuestas || 0}\n`;
      texto += `   📦 Total: ${u.total}\n\n`;
    }

    await conn.sendMessage(m.chat, {
      edit: carga.key,
      text: texto.trim()
    });
  }
};
