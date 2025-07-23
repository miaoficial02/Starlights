import { createHash } from 'crypto';
import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat];
  let user = global.db.data.users[m.sender];
  let bot = global.db.data.settings[conn.user.jid] || {};
  let type = command.toLowerCase();
  let isAll = false;

  let isEnable = chat[type] || false;

  if (args[0] === 'on' || args[0] === 'enable') {
    isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {
    isEnable = false;
  } else {
    const estado = isEnable ? '🟢 ACTIVADO' : '🔴 DESACTIVADO';
    return conn.reply(m.chat, `🧩 *ROXY CONFIGURADOR*\n━━━━━━━━━━━━━━━━━━━━━━\n🎮 *Senpai*, puedes controlar la función: *${command}*\n\n⚙️ Usa:\n• *${usedPrefix}${command} on* – Activar\n• *${usedPrefix}${command} off* – Desactivar\n━━━━━━━━━━━━━━━━━━━━━━\n🎯 *Estado actual:* ${estado}\n━━━━━━━━━━━━━━━━━━━━━━`, m);
  }

  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) throw false;
      } else if (!isAdmin) throw false;
      chat.welcome = isEnable;
      break;

    case 'antisubbots':
    case 'antisub':
    case 'antisubot':
    case 'antibot2':
      if (m.isGroup && !(isAdmin || isOwner)) throw false;
      chat.antiBot2 = isEnable;
      break;

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup && !(isAdmin || isOwner)) throw false;
      chat.modoadmin = isEnable;
      break;

    case 'reaction':
    case 'reaccion':
    case 'emojis':
      if (!m.isGroup) {
        if (!isOwner) throw false;
      } else if (!isAdmin) throw false;
      chat.reaction = isEnable;
      break;

    case 'nsfw':
    case 'nsfwhot':
    case 'nsfwhorny':
      if (!m.isGroup) {
        if (!isOwner) throw false;
      } else if (!isAdmin) throw false;
      chat.nsfw = isEnable;
      break;

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true;
      if (!isOwner) throw false;
      bot.jadibotmd = isEnable;
      break;

    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) throw false;
      } else if (!isAdmin) throw false;
      chat.detect = isEnable;
      break;

    case 'detect2':
    case 'eventos':
      if (!m.isGroup) {
        if (!isOwner) throw false;
      } else if (!isAdmin) throw false;
      chat.detect2 = isEnable;
      break;

    case 'antilink':
      if (m.isGroup && !(isAdmin || isOwner)) throw false;
      chat.antiLink = isEnable;
      break;

    case 'antilink2':
      if (m.isGroup && !(isAdmin || isOwner)) throw false;
      chat.antiLink2 = isEnable;
      break;

    default:
      return conn.reply(m.chat, '⚠️ ¡Esa función no está soportada!', m);
  }

  chat[type] = isEnable;

  conn.reply(m.chat, `╭━━🎉 *ROXY CONFIGURACIÓN COMPLETA* ━━╮
┃\n┃ 🧩 *Función:* ${type}\n┃ 🎛 *Estado:* ${isEnable ? '✅ ACTIVADO' : '❌ DESACTIVADO'}\n┃ ${isAll ? '⚙️ *Aplicado globalmente en el bot*' : '👥 *Aplicado solo en este grupo*'}
┃\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n✨ *¡Senpai, sigue configurando tu aventura Roxy!*`, m);
};

handler.help = ['welcome', 'bv', 'bienvenida', 'antisubbots', 'antisub', 'antisubot', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'emojis', 'nsfw', 'nsfwhot', 'nsfwhorny', 'jadibotmd', 'modejadibot', 'detect', 'avisos', 'detect2', 'eventos', 'antilink', 'antilink2'];
handler.tags = ['group', 'settings'];
handler.command = handler.help;
handler.register = true;

export default handler;