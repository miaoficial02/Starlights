const fs = require('fs');
const path = require('path');

let intervalId = null;

function cleanTmp(folder = './tmp') {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder);
  for (const file of files) {
    try {
      fs.unlinkSync(path.join(folder, file));
    } catch (e) {
      console.error(`[ERROR] Al borrar ${file}:`, e);
    }
  }
}

function parseTime(text) {
  const match = /^(\d+)(s|m|h)$/.exec(text.toLowerCase());
  if (!match) return null;
  const [_, num, unit] = match;
  const time = parseInt(num);
  if (unit === 's') return time * 1000;
  if (unit === 'm') return time * 60 * 1000;
  if (unit === 'h') return time * 60 * 60 * 1000;
  return null;
}

export default {
  name: 'limpiar',
  alias: ['cleantmp', 'limpiar'],
  description: 'Limpia la carpeta tmp (manual o cada cierto tiempo)',
  owner: true,
  async execute(m, { args }) {
    const folder = './tmp';

    if (args[0] === 'stop') {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        return m.reply('🛑 Limpieza automática detenida.');
      } else {
        return m.reply('⚠️ No hay limpieza automática activa.');
      }
    }

    if (args[0]) {
      const ms = parseTime(args[0]);
      if (!ms) return m.reply('❌ Formato inválido. Usa: `#limpiar`, `#limpiar 10m`, `#limpiar 1h`, `#limpiar stop`');

      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => cleanTmp(folder), ms);
      return m.reply(`🧼 Limpieza automática activada cada ${args[0]}`);
    }

    // Limpieza manual
    if (!fs.existsSync(folder)) return m.reply('❌ No existe la carpeta /tmp');
    const files = fs.readdirSync(folder);
    if (files.length === 0) return m.reply('🧹 No hay archivos para limpiar en /tmp');

    cleanTmp(folder);
    m.reply(`🧹 Se eliminaron ${files.length} archivos de /tmp.`);
  }
};
