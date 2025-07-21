const handler = async (m, { conn, participants, isAdmin, isBotAdmin, command }) => {
  if (!m.isGroup) return m.reply('❗ Este comando solo se puede usar en grupos.')
  if (!isAdmin) return m.reply('🛡️ Solo los administradores pueden usar este comando.')

  const countryFlags = {
    '502': '🇬🇹', // Guatemala
    '503': '🇸🇻', // El Salvador
    '504': '🇭🇳', // Honduras
    '505': '🇳🇮', // Nicaragua
    '506': '🇨🇷', // Costa Rica
    '507': '🇵🇦', // Panamá
    '51': '🇵🇪',  // Perú
    '52': '🇲🇽',  // México
    '54': '🇦🇷',  // Argentina
    '55': '🇧🇷',  // Brasil
    '56': '🇨🇱',  // Chile
    '57': '🇨🇴',  // Colombia
    '58': '🇻🇪',  // Venezuela
    '1': '🇺🇸',   // USA
    '34': '🇪🇸',  // España
    '91': '🇮🇳',  // India
    '93': '🇦🇫',  // Afganistán
    '212': '🇲🇦', // Marruecos
    '355': '🇦🇱', // Albania
    '84': '🇻🇳',  // Vietnam
    '976': '🇲🇳', // Mongolia
    '94': '🇱🇰'   // Sri Lanka
  }

  let text = '👥 *Invocando a todos los miembros:*\n\n'
  let mentions = []

  for (let user of participants) {
    const number = user.id.split('@')[0]
    const prefix = number.length > 5 ? number.slice(0, number.length - 7) : number
    const flag = countryFlags[prefix] || '🏳️'
    text += `${flag} @${number}\n`
    mentions.push(user.id)
  }

  await conn.sendMessage(m.chat, { text, mentions }, { quoted: m })
}

handler.help = ['invocar', 'todos']
handler.tags = ['grupo']
handler.command = ['invocar', 'todos']
handler.group = true

export default handler