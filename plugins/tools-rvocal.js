//▪CÓDIGO POR DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import axios from 'axios'

let handler = async (m, { conn, args }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  
  if (!mime.startsWith('audio/')) return m.reply('Envía o responde a un audio.')

  m.reply('Por favor espera...')

  try {
    const audioBuffer = await q.download()
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2)
    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="fileName"; filename="audio.mp3"\r\n`),
      Buffer.from(`Content-Type: audio/mpeg\r\n\r\n`),
      audioBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ])

    const uploadRes = await axios.post('https://aivocalremover.com/api/v2/FileUpload', multipartBody, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': multipartBody.length,
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (uploadRes.data?.error) throw new Error(uploadRes.data.message)

    const params = new URLSearchParams({
      file_name: uploadRes.data.file_name,
      action: 'watermark_video',
      key: uploadRes.data.key,
      web: 'web'
    })

    const processRes = await axios.post('https://aivocalremover.com/api/v2/ProcessFile', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (processRes.data?.error) throw new Error(processRes.data.message)

    // Enviar pista instrumental
    await conn.sendMessage(m.chat, { 
      audio: { url: processRes.data.instrumental_path }, 
      mimetype: 'audio/mpeg',
      fileName: 'instrumental.mp3'
    }, { quoted: m })
    
    // Enviar pista vocal
    await conn.sendMessage(m.chat, { 
      audio: { url: processRes.data.vocal_path }, 
      mimetype: 'audio/mpeg',
      fileName: 'vocal.mp3'
    }, { quoted: m })

  } catch (e) {
    m.reply('Error: ' + e.message)
  }
}

handler.help = ['rvocal']
handler.command = ['rvocal']
handler.tags = ['tools']

export default handler