import fs from 'fs';

const RUTA_DB = './database/estadisticas.json';

let db = {};
if (fs.existsSync(RUTA_DB)) {
  db = JSON.parse(fs.readFileSync(RUTA_DB));
}

function guardarDB() {
  fs.writeFileSync(RUTA_DB, JSON.stringify(db, null, 2));
}

function tipoMensaje(m) {
  const msg = m.message || {};
  if (msg.imageMessage) return 'imagenes';
  if (msg.videoMessage) return 'videos';
  if (msg.audioMessage) return 'audios';
  if (msg.stickerMessage) return 'stickers';
  if (msg.pollCreationMessage) return 'encuestas';
  return 'mensajes';
}

export async function all(m) {
  const chatId = m.chat;
  const sender = m.sender;
  if (!m.isGroup) return;

  if (!db[chatId]) db[chatId] = {};
  if (!db[chatId][sender]) {
    db[chatId][sender] = {
      mensajes: 0,
      imagenes: 0,
      videos: 0,
      audios: 0,
      stickers: 0,
      encuestas: 0
    };
  }

  const tipo = tipoMensaje(m);
  if (db[chatId][sender][tipo] !== undefined) {
    db[chatId][sender][tipo]++;
  }

  guardarDB();
}

export const handler = {
  command: ['estadisticas', 'contar'],
  tags: ['group'],
  help: ['estadisticas', 'contar'],
  group: true,

  async handler(m, { conn, participants }) {
    const sender = m.sender;
    const isAdmin = participants?.some(p => p.id === sender && p.admin);

    if (!isAdmin) {
      return m.reply('🚫 Este comando solo lo pueden usar los administradores del grupo.');
    }

    const chatId = m.chat;
    if (!db[chatId]) return m.reply('❌ No hay datos para este grupo todavía.');

    // Simular barra de carga
    const msg = await m.reply('⏳ Procesando estadísticas...\n[░░░░░░░░░░] 0%');
    const pasos = ['10%', '30%', '50%', '70%', '90%', '100%'];
    for (const paso of pasos) {
      await new Promise(res => setTimeout(res, 200));
      await conn.sendMessage(m.chat, {
        edit: msg.key,
        text: `⏳ Procesando estadísticas...\n[${'▓'.repeat(pasos.indexOf(paso)+1)}${'░'.repeat(10 - pasos.indexOf(paso)-1)}] ${paso}`
      });
    }

    const lista = Object.entries(db[chatId]).map(([jid, datos]) => {
      const total = Object.values(datos).reduce((a, b) => a + b, 0);
      return { jid, total, datos };
    }).sort((a, b) => b.total - a.total);

    let texto = `📊 *Ranking de participación:*\n\n`;

    for (let i = 0; i < lista.length; i++) {
      const { jid, total, datos } = lista[i];
      const nombre = (await conn.getName(jid).catch(() => jid.split('@')[0])) || jid.split('@')[0];
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
      edit: msg.key,
      text: texto.trim()
    });
  }
};
