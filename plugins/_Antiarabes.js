

// Plugin antiarabes - Elimina automáticamente números con prefijos árabes
// Funciona de manera similar al antilink pero para números específicos

const prefijosArabes = [
    '212', // Marruecos
    '213', // Argelia  
    '216', // Túnez
    '218', // Libia
    '220', // Gambia
    '221', // Senegal
    '222', // Mauritania
    '223', // Mali
    '224', // Guinea
    '225', // Costa de Marfil
    '226', // Burkina Faso
    '227', // Níger
    '228', // Togo
    '229', // Benín
    '230', // Mauricio
    '231', // Liberia
    '232', // Sierra Leona
    '233', // Ghana
    '234', // Nigeria
    '235', // Chad
    '236', // República Centroafricana
    '237', // Camerún
    '238', // Cabo Verde
    '239', // Santo Tomé y Príncipe
    '240', // Guinea Ecuatorial
    '241', // Gabón
    '242', // República del Congo
    '243', // República Democrática del Congo
    '244', // Angola
    '245', // Guinea-Bisáu
    '246', // Diego García
    '247', // Ascensión
    '248', // Seychelles
    '249', // Sudán
    '250', // Ruanda
    '251', // Etiopía
    '252', // Somalia
    '253', // Yibuti
    '254', // Kenia
    '255', // Tanzania
    '256', // Uganda
    '257', // Burundi
    '258', // Mozambique
    '260', // Zambia
    '261', // Madagascar
    '262', // Reunión/Mayotte
    '263', // Zimbabue
    '264', // Namibia
    '265', // Malaui
    '266', // Lesoto
    '267', // Botsuana
    '268', // Suazilandia
    '269', // Comoras
    '290', // Santa Elena
    '291', // Eritrea
    '297', // Aruba
    '298', // Islas Feroe
    '299', // Groenlandia
    '350', // Gibraltar
    '351', // Portugal
    '352', // Luxemburgo
    '353', // Irlanda
    '354', // Islandia
    '355', // Albania
    '356', // Malta
    '357', // Chipre
    '358', // Finlandia
    '359', // Bulgaria
    '370', // Lituania
    '371', // Letonia
    '372', // Estonia
    '373', // Moldavia
    '374', // Armenia
    '375', // Bielorrusia
    '376', // Andorra
    '377', // Mónaco
    '378', // San Marino
    '380', // Ucrania
    '381', // Serbia
    '382', // Montenegro
    '383', // Kosovo
    '385', // Croacia
    '386', // Eslovenia
    '387', // Bosnia y Herzegovina
    '389', // Macedonia del Norte
    '420', // República Checa
    '421', // Eslovaquia
    '423', // Liechtenstein
    '590', // Guadalupe/San Martín/San Bartolomé
    '591', // Bolivia
    '592', // Guyana
    '593', // Ecuador
    '594', // Guayana Francesa
    '595', // Paraguay
    '596', // Martinica
    '597', // Surinam
    '598', // Uruguay
    '599', // Antillas Neerlandesas
    '670', // Timor Oriental
    '672', // Territorio Antártico Australiano
    '673', // Brunéi
    '674', // Nauru
    '675', // Papúa Nueva Guinea
    '676', // Tonga
    '677', // Islas Salomón
    '678', // Vanuatu
    '679', // Fiyi
    '680', // Palaos
    '681', // Wallis y Futuna
    '682', // Islas Cook
    '683', // Niue
    '684', // Samoa Americana
    '685', // Samoa
    '686', // Kiribati
    '687', // Nueva Caledonia
    '688', // Tuvalu
    '689', // Polinesia Francesa
    '690', // Tokelau
    '691', // Micronesia
    '692', // Islas Marshall
    '850', // Corea del Norte
    '852', // Hong Kong
    '853', // Macao
    '855', // Camboya
    '856', // Laos
    '880', // Bangladés
    '886', // Taiwán
    '960', // Maldivas
    '961', // Líbano
    '962', // Jordania
    '963', // Siria
    '964', // Irak
    '965', // Kuwait
    '966', // Arabia Saudí
    '967', // Yemen
    '968', // Omán
    '970', // Palestina
    '971', // Emiratos Árabes Unidos
    '972', // Israel
    '973', // Baréin
    '974', // Catar
    '975', // Bután
    '976', // Mongolia
    '977', // Nepal
    '992', // Tayikistán
    '993', // Turkmenistán
    '994', // Azerbaiyán
    '995', // Georgia
    '996', // Kirguistán
    '998'  // Uzbekistán
];

function esNumeroArabe(numero) {
    // Limpiar el número de caracteres no numéricos excepto el +
    const numeroLimpio = numero.replace(/[^\d+]/g, '');
    
    // Verificar si empieza con + seguido de algún prefijo árabe
    for (const prefijo of prefijosArabes) {
        if (numeroLimpio.startsWith(`+${prefijo}`) || numeroLimpio.startsWith(prefijo)) {
            return true;
        }
    }
    return false;
}

// Comando para activar/desactivar antiarabes
let handler = async (m, { conn, isAdmin, isBotAdmin, command }) => {
    if (!m.isGroup) return m.reply('❌ Este comando solo funciona en grupos.');
    if (!isAdmin) return m.reply('❌ Solo los administradores pueden usar este comando.');
    if (!isBotAdmin) return m.reply('❌ El bot debe ser administrador para usar esta función.');

    let chat = global.db.data.chats[m.chat];
    
    if (command === 'antiarabes') {
        let status = chat.antiarabes ? '✅ Activado' : '❌ Desactivado';
        return m.reply(`🛡️ *Estado del AntiÁrabes:* ${status}\n\n📝 *Comandos disponibles:*\n• *.antiarabes on* - Activar\n• *.antiarabes off* - Desactivar`);
    }
    
    if (command === 'antiarabeson' || command === 'antiarabes.on') {
        chat.antiarabes = true;
        m.reply('✅ *AntiÁrabes activado*\n\n🗑️ Los números con prefijos árabes serán eliminados automáticamente.');
    } else if (command === 'antiarabesoff' || command === 'antiarabes.off') {
        chat.antiarabes = false;
        m.reply('❌ *AntiÁrabes desactivado*\n\n👥 Los números árabes ya no serán eliminados automáticamente.');
    }
};

handler.help = ['antiarabes', 'antiarabeson', 'antiarabesoff'];
handler.tags = ['grupo'];
handler.command = ['antiarabes', 'antiarabeson', 'antiarabesoff', 'antiarabes.on', 'antiarabes.off'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

// Función before para ejecutar automáticamente
export async function before(m, { conn, participants, isBotAdmin }) {
    if (!m.isGroup || m.isBaileys || !isBotAdmin) return;

    let chat = global.db.data.chats[m.chat];
    
    // Si antiarabes está desactivado, no hacer nada
    if (!chat.antiarabes) return;

    const sender = m.sender;
    const numeroSender = sender.replace('@s.whatsapp.net', '');

    // Verificar si el remitente tiene un número árabe
    if (esNumeroArabe(numeroSender)) {
        try {
            // Eliminar al usuario inmediatamente
            await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
            
            // Enviar mensaje discreto
            await conn.sendMessage(m.chat, {
                text: `🗑️ Escoria humana eliminada`,
            });

        } catch (error) {
            console.error('Error eliminando usuario árabe:', error);
        }
    }

    // También verificar cuando se unen nuevos miembros
    if (m.messageStubType === 27 || m.messageStubType === 31) { // Cuando alguien se une
        const newMembers = m.messageStubParameters || [];
        
        for (const newMember of newMembers) {
            const numeroMiembro = newMember.replace('@s.whatsapp.net', '');
            
            if (esNumeroArabe(numeroMiembro)) {
                try {
                    await conn.groupParticipantsUpdate(m.chat, [newMember], 'remove');
                    await conn.sendMessage(m.chat, {
                        text: `🗑️ Escoria humana eliminada`,
                    });
                } catch (error) {
                    console.error('Error eliminando nuevo miembro árabe:', error);
                }
            }
        }
    }
}

