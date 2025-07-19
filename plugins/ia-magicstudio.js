import axios from 'axios'              // Importa axios para hacer peticiones HTTP
import FormData from 'form-data'       // Importa FormData para enviar datos en formato formulario
import { v4 as uuidv4 } from 'uuid'    // Importa uuidv4 para generar identificadores únicos

// Función que genera un ID aleatorio con letras y números
function generateClientId(length = 40) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

// Función que hace la petición para generar la imagen con MagicStudio
async function magicstudio(prompt) {
  const anonymousUserId = uuidv4()                      // Genera un ID único anónimo
  const requestTimestamp = (Date.now() / 1000).toFixed(3) // Tiempo actual en segundos con 3 decimales
  const clientId = generateClientId()                   // Genera un ID de cliente aleatorio

  // Prepara los datos para enviar a la API en formato formulario
  const formData = new FormData()
  formData.append('prompt', prompt)                      // Texto que describe la imagen
  formData.append('output_format', 'bytes')              // Formato de salida (bytes)
  formData.append('user_profile_id', 'null')             // Perfil de usuario (nulo)
  formData.append('anonymous_user_id', anonymousUserId)  // ID anónimo
  formData.append('request_timestamp', requestTimestamp) // Tiempo de la petición
  formData.append('user_is_subscribed', 'false')         // Indica que no está suscrito
  formData.append('client_id', clientId)                  // ID del cliente generado

  // Configuración para la petición POST a la API
  const config = {
    method: 'POST',
    url: 'https://ai-api.magicstudio.com/api/ai-art-generator',
    headers: {
      ...formData.getHeaders(),                           // Agrega encabezados necesarios para FormData
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'origin': 'https://magicstudio.com',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'referer': 'https://magicstudio.com/ai-art-generator/',
      'accept-language': 'en-US,en;q=0.9'
    },
    responseType: 'arraybuffer',                         // La respuesta será un buffer binario (imagen)
    data: formData                                       // Los datos enviados (formulario)
  }

  try {
    const response = await axios.request(config)        // Hace la petición POST con axios
    return response.data                                 // Devuelve la imagen recibida
  } catch (error) {
    throw new Error('Error al generar la imagen con IA') // En caso de error, lanza este mensaje
  }
}

// Handler que procesa el comando magicstudio en el bot
let handler = async (m, { conn, args }) => {
  try {
    const prompt = args.join(' ')                        // Une los argumentos en un texto
    if (!prompt) return m.reply('Escribe un texto para generar imagen\n\nEjemplo: .magicstudio chica anime con cabello azul')
    
    m.reply('🔄 Generando imagen, espera...')            // Mensaje de espera
    
    const imageBuffer = await magicstudio(prompt)        // Llama a la función para generar la imagen
    
    await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m })  // Envía la imagen al chat
  } catch (e) {
    m.reply('❌ ' + e.message)                           // Si falla, envía el error
  }
}

handler.help = ['magicstudio']                            // Ayuda que aparece en el comando
handler.command = ['magicstudio']                         // Comando que activa esta función
handler.tags = ['ai']                                     // Categoría o etiqueta del comando

export default handler                                    // Exporta el handler para usarlo en el bot