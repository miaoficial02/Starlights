const fs = require('fs');
const path = require('path');

const tmpFolder = './tmp';

function cleanTmp() {
  if (!fs.existsSync(tmpFolder)) return;
  fs.readdir(tmpFolder, (err, files) => {
    if (err) return;
    for (const file of files) {
      fs.unlink(path.join(tmpFolder, file), (err) => {
        if (err) console.error(`[ERROR al borrar]: ${file}`, err);
      });
    }
  });
}

setInterval(cleanTmp, 10 * 60 * 1000); // cada 10 minutos
