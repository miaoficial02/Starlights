import fs from 'fs';

const RUTA_DB = './contadorMensajes.json';

let db = {};
if (fs.existsSync(RUTA_DB)) {
  db = JSON.parse(fs.readFileSync(RUTA_DB));
}

function guardarDB() {
  fs.writeFileSync(RUTA_DB, JSON.stringify(db, null, 2));
}

function tipoMensaje(m) {
  if (m.message?.imageMessage) return 'imagenes';
  if (m.message?.videoMessage) return 'videos';
  if (m.message?.audioMessage) return 'audios';
  if (m.message?.stickerMessage) return 'stickers';
  if (m.message?.pollCreationMessage) return 'encuestas';
  if (m.text) return 'mensajes';
  return 'otros';
}

export const handler = {
  command: ['contar', 'estadisticas'],
  tags: ['group'],
  help: ['contar', 'estadisticas'],
  group: true,

  async all(m) {
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
        encuestas: 0,
        otros: 0
      };
    }

    const tipo = tipoMensaje(m);
    if (db[chatId][sender][tipo] !== undefined) {
      db[chatId][sender][tipo]++;
    } else {
      db[chatId][sender].otros++;
    }

    guardarDB();
  },

  async handler(m, { conn, participants }) {
    const sender = m.sender;
    const isAdmin = participants?.some(p => p.id === sender && p.admin);

    if (!isAdmin) {
      return m.reply('🚫 Solo los administradores del grupo pueden usar este comando.');
    }

    const chatId = m.chat;
    if (!db[chatId]) return m.reply('❌ No hay datos en este grupo todavía.');

    // Barra de carga simulada
    const loadingMsg = await m.reply(`⏳ Procesando estadísticas...\n▭▭▭▭▭▭▭▭▭▭ 0%`);
    const etapas = [
      '▮▭▭▭▭▭▭▭▭▭ 10%',
      '▮▮▭▭▭▭▭▭▭▭ 20%',
      '▮▮▮▭▭▭▭▭▭▭ 30%',
      '▮▮▮▮▭▭▭▭▭▭ 40%',
      '▮▮▮▮▮▭▭▭▭▭ 50%',
      '▮▮▮▮▮▮▭▭▭▭ 60%',
      '▮▮▮▮▮▮▮▭▭▭ 70%',
      '▮▮▮▮▮▮▮▮▭▭ 80%',
      '▮▮▮▮▮▮▮▮▮▭ 90%',
      '▮▮▮▮▮▮▮▮▮▮ 100%',
    ];

    for (let etapa of etapas) {
      await new Promise(r => setTimeout(r, 150));
      await conn.sendMessage(m.chat, { edit: loadingMsg.key, text: `⏳ Procesando estadísticas...\n${etapa}` });
    }

    // Generar ranking por cantidad total de mensajes
    const totalPorUsuario = Object.entries(db[chatId])
      .map(([jid, datos]) => {
        return {
          jid,
          total: (datos.mensajes || 0) + (datos.imagenes || 0) + (datos.videos || 0) + (datos.audios || 0) + (datos.stickers || 0) + (datos.encuestas || 0),
          datos
        };
      })
      .sort((a, b) => b.total - a.total);

    let texto = `📊 *Estadísticas de participación en el grupo:*\n\n`;

    for (let i = 0; i < totalPorUsuario.length; i++) {
      const { jid, total, datos } = totalPorUsuario[i];
      const nombre = (await conn.getName(jid)) || jid.split('@')[0];

      const medalla =
        i === 0 ? '🥇' :
        i === 1 ? '🥈' :
        i === 2 ? '🥉' : `🔹`;

      texto += `${medalla} *${nombre}*\n`;
      texto += `   📨 Mensajes: ${datos.mensajes || 0}\n`;
      texto += `   🖼️ Imágenes: ${datos.imagenes || 0}\n`;
      texto += `   📹 Videos: ${datos.videos || 0}\n`;
      texto += `   🎧 Audios: ${datos.audios || 0}\n`;
      texto += `   🔖 Stickers: ${datos.stickers || 0}\n`;
      texto += `   🗳️ Encuestas: ${datos.encuestas || 0}\n`;
      texto += `   📦 Total: ${total}\n\n`;
    }

    await conn.sendMessage(m.chat, {
      edit: loadingMsg.key,
      text: texto.trim()
    });
  }
};
