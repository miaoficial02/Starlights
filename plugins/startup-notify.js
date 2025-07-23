import fs from 'fs';
import moment from 'moment-timezone';

export const handler = {
  command: [],
  tags: ['hidden'],
  help: [],
  async before(m, { conn }) {
    const ruta = './notificar.json';
    if (!fs.existsSync(ruta)) return;

    try {
      const { owner } = JSON.parse(fs.readFileSync(ruta));
      if (!owner) return;

      // Calcular fecha y hora
      const ahora = moment().tz('America/Bogota'); // Cambia la zona si estás en otro país
      const fechaHora = ahora.format('DD/MM/YYYY - HH:mm:ss');

      // Prueba de latencia
      const inicio = performance.now();
      await conn.sendPresenceUpdate('composing', `${owner}@s.whatsapp.net`);
      const fin = performance.now();
      const latencia = Math.round(fin - inicio);

      // Mensaje al owner
      await conn.sendMessage(`${owner}@s.whatsapp.net`, {
        text: `✅ *El bot está nuevamente en línea*\n\n📅 Fecha: ${fechaHora}\n📡 Latencia: ${latencia} ms`
      });

      // Limpiar para que no vuelva a enviar
      fs.unlinkSync(ruta);
    } catch (err) {
      console.error('[ERROR startup-notify]', err);
    }
  }
};
