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

  // Conteo automático
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

  // Comando principal
  async handler(m, { conn, participants }) {
    const sender = m.sender;
    const isAdmin = participants?.some(p => p.id === sender && p.admin);

    if (!isAdmin) {
      return m.reply('🚫 Solo los administradores del grupo pueden usar este comando.');
    }

    const chatId = m.chat;
    if (!db[chatId]) return m.reply('❌ No hay datos en este grupo todavía.');

    // Enviar barra de carga falsa
    const loadingMsg = await m.reply(`⏳ Procesando estadísticas...\n▭▭▭▭▭▭▭▭▭▭ 0%`);

    let etapas = [
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
      await new Promise(r => setTimeout(r, 200)); // Simula progreso
      await conn.sendMessage(m.chat, { edit: loadingMsg.key, text: `⏳ Procesando estadísticas...\n${etapa}` });
    }

    // Preparar estadísticas
    let texto = `📊 *Estadísticas de mensajes en este grupo:*\n\n`;

    const participantes = Object.entries(db[chatId]);

    for (const [jid, datos] of participantes) {
      const nombre = (await conn.getName(jid)) || jid.split('@')[0];
      texto += `👤 *${nombre}*\n`;
      texto += `   📨 Mensajes: ${datos.mensajes || 0}\n`;
      texto += `   🖼️ Imágenes: ${datos.imagenes || 0}\n`;
      texto += `   📹 Videos: ${datos.videos || 0}\n`;
      texto += `   🎧 Audios: ${datos.audios || 0}\n`;
      texto += `   🔖 Stickers: ${datos.stickers || 0}\n`;
      texto += `   🗳️ Encuestas: ${datos.encuestas || 0}\n\n`;
    }

    // Reemplaza barra de carga por estadísticas finales
    await conn.sendMessage(m.chat, {
      edit: loadingMsg.key,
      text: texto.trim()
    });
  }
};
