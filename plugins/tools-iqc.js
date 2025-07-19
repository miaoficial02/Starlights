//▪CÓDIGO POR DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import moment from 'moment-timezone'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Ingresa un texto\nEjemplo: .iqc hola mundo')
  
  const position = Math.random() < 0.5 ? 'left' : 'right' // Posición aleatoria del personaje
  const time = moment().tz('Asia/Jakarta').format('HH:mm') // Hora con zona horaria de Yakarta
  
  await conn.sendMessage(m.chat, { 
    image: { 
      url: `https://velyn.mom/api/maker/iqc?message=${encodeURIComponent(text)}&position=${position}&jam=${encodeURIComponent(time)}`
    },
  }, { quoted: m })
}

handler.help = ['iqc <texto>']
handler.tags = ['tools']
handler.command = ['iqc']

export default handler