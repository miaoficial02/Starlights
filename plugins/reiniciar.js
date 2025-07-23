import fs from 'fs';
import { spawn } from 'child_process';

export const handler = {
  command: ['reiniciar'],
  tags: ['owner'],
  help: ['reiniciar'],
  owner: true,
  async handler(m, { conn }) {
    const ownerId = m.sender.split('@')[0];
    fs.writeFileSync('./notificar.json', JSON.stringify({ owner: ownerId }));

    m.reply('♻️ Reiniciando el bot...');

    spawn(process.argv[0], ['.'], {
      stdio: 'inherit',
      detached: true
    });

    process.exit();
  }
};
