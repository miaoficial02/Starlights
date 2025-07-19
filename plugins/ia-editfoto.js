//▪CÓDIGO BY DEVBRAYAN PRROS XD▪
//▪ROXY BOT MD▪

import axios from 'axios'
import FormData from 'form-data'

// Función para editar una imagen con un prompt usando la API de OpenAI
async function editImage(imageBuffer, prompt) {
  const form = new FormData()
  form.append('image', imageBuffer, {
    filename: 'image.png',
    contentType: 'image/png'
  })
  form.append('prompt', prompt)
  form.append('model', 'gpt-image-1')
  form.append('n', '1')
  form.append('size', '1024x1024')
  form.append('quality', 'medium')

  const response = await axios.post(
    'https://api.openai.com/v1/images/edits',
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer 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`
      }
    }
  )

  const base64 = response.data?.data?.[0]?.b64_json
  if (!base64) throw new Error('No hubo respuesta de la API de OpenAI.')
  return Buffer.from(base64, 'base64')
}

// Manejador del comando .editfoto
const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`Ejemplo: .editfoto convertir a anime`)

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime.startsWith('image/')) return m.reply(`Por favor responde a una imagen. Ejemplo: .editfoto convertir a anime`)

  try {
    m.reply('Espera un momento...')
    let img = await q.download()
    let resultBuffer = await editImage(img, text)
    await conn.sendFile(m.chat, resultBuffer, 'edit.png', '¡Listo!', m)
  } catch (err) {
    m.reply(`Ocurrió un error: ${err.message}`)
  }
}

handler.help = ['editfoto <descripción>']
handler.tags = ['ai']
handler.command = ['editfoto']

export default handler