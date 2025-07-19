import moment from 'moment-timezone'

const banderas = {
  '91': '🇮🇳', '55': '🇧🇷', '34': '🇪🇸', '52': '🇲🇽', '1': '🇺🇸',
  '57': '🇨🇴', '51': '🇵🇪', '593': '🇪🇨', '502': '🇬🇹', '54': '🇦🇷',
  '595': '🇵🇾', '56': '🇨🇱', '58': '🇻🇪', '591': '🇧🇴', '505': '🇳🇮',
  '504': '🇭🇳', '503': '🇸🇻', '507': '🇵🇦', '592': '🇬🇾', '53': '🇨🇺',
  '998': '🇺🇿', '60': '🇲🇾', '62': '🇮🇩', '81': '🇯🇵', '82': '🇰🇷',
  '237': '🇨🇲', '234': '🇳🇬', '27': '🇿🇦', '66': '🇹🇭', '84': '🇻🇳',
  '91': '🇮🇳', '86': '🇨🇳'
}

let handler = async (m, { conn, participants, args }) => {
  if (!m.isGroup) return m.reply('❌ Este comando solo se puede usar en grupos.')

  let texto = args.length > 0 ? args.join(' ') : '📣 *Atención a todos los miembros:*'
  let mensaje = `${texto}\n\n`

  const mentions = []
  for (let p of participants) {
    const numero = p.id.split('@')[0]
    const codigo = numero.length > 5 ? numero.slice(0, numero.length - 7) : '1' // fallback

    const bandera = banderas[codigo] || '🌐'
    mensaje += `🔔 ${bandera} @${numero}\n`
    mentions.push(p.id)
  }

  await conn.sendMessage(m.chat, {
    text: mensaje,
    mentions
  }, { quoted: m })
}

handler.command = ['invocar', 'todxs', 'tod@s']
handler.group = true
handler.tags = ['group']
handler.help = ['invocar', 'todos', 'tod@s']

export default handler