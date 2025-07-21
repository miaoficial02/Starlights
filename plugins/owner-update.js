import { execSync } from 'child_process';

let handler = async (m, { conn, args }) => { 
    try { 
        await conn.reply(m.chat, '✨️ Actualizando el bot, por favor espere...', m, fake)

        const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString();
        let response = output.includes('Already up to date') 
            ? '✨️ El bot ya está actualizado.' 
            : `✨️ Se han aplicado actualizaciones:\n\n${output}`;

        await conn.reply(m.chat, response, m, fake);

    } catch (error) { 
        try { 
            const status = execSync('git status --porcelain').toString().trim(); 
            if (status) { 
                const conflictedFiles = status.split('\n').filter(line => 
                    !line.includes('roxySession/') && 
                    !line.includes('.cache/') && 
                    !line.includes('tmp/')
                ); 

                if (conflictedFiles.length > 0) { 
                    const conflictMsg = `⚠️ Conflictos detectados en los siguientes archivos:\n\n` +
                        conflictedFiles.map(f => '• ' + f.slice(3)).join('\n') +
                        `\n\n🔹 Para solucionar esto, reinstala el bot o actualiza manualmente.`;

                    return await conn.reply(m.chat, conflictMsg, m, fake); 
                } 
            } 
        } catch (statusError) { 
            console.error(statusError); 
        }

        await conn.reply(m.chat, `❌ Error al actualizar: ${error.message || 'Error desconocido.'}`, m, fake);
    } 
};

handler.help = ['update', 'actualizar'];
handler.command = ['update', 'actualizar']
handler.tags = ['owner'];
handler.rowner = true;

export default handler;