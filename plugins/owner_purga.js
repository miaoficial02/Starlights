
var handler = async (m, { conn, participants, isROwner }) => {
    const pikachu = 'Ｏ(≧∇≦)Ｏ🧃';
    const sadchu = 'Ｏ(≧∇≦)Ｏ🧃';

    if (!isROwner) {
        return conn.reply(m.chat, `${sadchu} ¡Solo el owner principal puede usar este comando!`, m, rcanal);
    }

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const botJid = conn.user.jid;

    // Filtrar participantes (excluir al bot y al owner del grupo)
    const membersToRemove = participants
        .map(p => p.id)
        .filter(id => id !== botJid && id !== ownerGroup && id !== m.sender);

    if (membersToRemove.length === 0) {
        return conn.reply(m.chat, `${sadchu} No hay miembros para eliminar del grupo.`, m, rcanal);
    }

    // Mensaje de confirmación
    await conn.reply(m.chat, `${pikachu} ¡PURGA INICIADA!\n\n⚠️ Eliminando ${membersToRemove.length} miembros del grupo...`, m, rcanal);

    try {
        // Eliminar miembros de a uno para evitar errores
        for (let i = 0; i < membersToRemove.length; i++) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [membersToRemove[i]], 'remove');
                // Pequeña pausa entre eliminaciones
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.log(`Error eliminando usuario ${membersToRemove[i]}:`, error);
            }
        }

        await conn.reply(m.chat, `${pikachu} ¡PURGA COMPLETADA!\n\n⚡ Se han eliminado todos los miembros del grupo con Impactrueno.`, m, rcanal);

    } catch (error) {
        console.error('Error en purga:', error);
        await conn.reply(m.chat, `${sadchu} Hubo un error durante la purga: ${error.message}`, m, rcanal);
    }
};

handler.help = ['purga'];
handler.tags = ['grupo'];
handler.command = ['purga', 'purgar', 'limpiar'];
handler.rowner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
