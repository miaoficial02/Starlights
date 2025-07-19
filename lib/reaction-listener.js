import {
  partidas,
  EMOJI_TITULAR,
  EMOJI_SUPLENTE,
  MAX_TITULARES,
  MAX_SUPLENTES,
  generarMensaje,
} from '../plugins/4vs4.js'; // Ajusta la ruta según tu estructura

export default async function handleReaction({ conn, emoji, user, chat, msgId }) {
  const partida = partidas[chat];
  if (!partida || partida.msgId !== msgId || partida.finalizado) return;
  if (!emoji || (emoji !== EMOJI_TITULAR && emoji !== EMOJI_SUPLENTE)) return;

  const yaEnLista = partida.titulares.includes(user) || partida.suplentes.includes(user);
  if (yaEnLista) return;

  if (emoji === EMOJI_TITULAR && partida.titulares.length < MAX_TITULARES) {
    partida.titulares.push(user);
  } else if (emoji === EMOJI_SUPLENTE && partida.suplentes.length < MAX_SUPLENTES) {
    partida.suplentes.push(user);
  } else {
    return;
  }

  // Finaliza si ya se llenaron todos los cupos
  const completo = partida.titulares.length === MAX_TITULARES &&
                   partida.suplentes.length === MAX_SUPLENTES;
  if (completo) partida.finalizado = true;

  // 🗑️ Borra el mensaje anterior
  try {
    await conn.sendMessage(chat, { delete: partida.msgKey });
  } catch (e) {
    console.error('Error al eliminar mensaje anterior:', e);
  }

  // ✉️ Envía el mensaje actualizado
  const texto = generarMensaje(partida.titulares, partida.suplentes);
  const nuevo = await conn.sendMessage(chat, {
    text: texto,
    mentions: [...partida.titulares, ...partida.suplentes],
  });

  // 💾 Actualiza referencia al nuevo mensaje
  partida.msgId = nuevo.key.id;
  partida.msgKey = nuevo.key;

  // 🧷 Reacciona de nuevo si no está completo
  if (!completo) {
    await conn.sendMessage(chat, { react: { text: EMOJI_TITULAR, key: nuevo.key } });
    await conn.sendMessage(chat, { react: { text: EMOJI_SUPLENTE, key: nuevo.key } });
  }
}