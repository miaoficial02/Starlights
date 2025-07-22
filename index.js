process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import {createRequire} from 'module'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import fs, {readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser} = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000


const originalConsoleError = console.error;
console.error = function (...args) {
    const msg = args.join(' ');
    if (
        msg.includes('Failed to decrypt message with any known session') ||
        msg.includes('Bad MAC') ||
        msg.includes('Closing stale open session for new outgoing prekey bundle')
    ) {
        return; 
    }
    originalConsoleError.apply(console, args);
};

let { say } = cfonts




const sleep = ms => new Promise(res => setTimeout(res, ms))

async function showBanner() {

    const title = `
█▀▀▄ ▄▀▄ █░█ ▄▀▀░
█▐█▀ █░█ ▄▀▄ █░▀▌
▀░▀▀ ░▀░ ▀░▀ ▀▀▀░

    `.split('\n').map(line => chalk.hex('#ff00cc').bold(line)).join('\n')

    const subtitle = chalk.hex('#00eaff').bold('✦ ROXYBOT-MD ✦').padStart(40)
    const poweredMsg = chalk.hex('#00eaff').italic('powered by Brayan')
    const aiMsg = chalk.hex('#ffb300').bold('🤖 RoxyAi - Tu compañera virtual')
    const tips = [
        chalk.hex('#ffb300')('💡 Tip: Usa /help para ver los comandos disponibles.'),
        chalk.hex('#00eaff')('🌐 Síguenos en GitHub para actualizaciones.'),
        chalk.hex('#ff00cc')('✨ Disfruta de la experiencia premium de nagitBot.')
    ]
    const loadingFrames = [
        chalk.magentaBright('⠋ Cargando módulos...'),
        chalk.magentaBright('⠙ Cargando módulos...'),
        chalk.magentaBright('⠹ Cargando módulos...'),
        chalk.magentaBright('⠸ Cargando módulos...'),
        chalk.magentaBright('⠼ Cargando módulos...'),
        chalk.magentaBright('⠴ Cargando módulos...'),
        chalk.magentaBright('⠦ Cargando módulos...'),
        chalk.magentaBright('⠧ Cargando módulos...'),
        chalk.magentaBright('⠇ Cargando módulos...'),
        chalk.magentaBright('⠏ Cargando módulos...')
    ]

    console.clear()
   
    console.log(
        boxen(
            title + '\n' + subtitle,
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'magentaBright',
                backgroundColor: 'black',
                title: 'Roxy AI',
                titleAlignment: 'center'
            }
        )
    )

    say('RoxyAi', {
        font: 'block',
        align: 'center',
        colors: ['magentaBright', 'cyan'],
        background: 'transparent',
        letterSpacing: 1,
        lineHeight: 1
    })
    say('powered by Brayan', {
        font: 'console',
        align: 'center',
        colors: ['blueBright'],
        background: 'transparent'
    })
    console.log('\n' + aiMsg + '\n')

  
    for (let i = 0; i < 18; i++) {
        process.stdout.write('\r' + loadingFrames[i % loadingFrames.length])
        await sleep(70)
    }
    process.stdout.write('\r' + ' '.repeat(40) + '\r') 

  
    console.log(
        chalk.bold.cyanBright(
            boxen(
                chalk.bold('¡Bienvenido a RoxyAi!\n') +
                chalk.hex('#00eaff')('La bot está arrancando, por favor espere...') +
                '\n' +
                tips.join('\n'),
                {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'cyan'
                }
            )
        )
    )
    // Efecto de "sparkle" final
    const sparkles = [
        chalk.hex('#ff00cc')('✦'), chalk.hex('#00eaff')('✦'), chalk.hex('#ffb300')('✦'),
        chalk.hex('#00eaff')('✦'), chalk.hex('#ff00cc')('✦'), chalk.hex('#ffb300')('✦')
    ]
    let sparkleLine = ''
    for (let i = 0; i < 30; i++) {
        sparkleLine += sparkles[i % sparkles.length]
    }
    console.log('\n' + sparkleLine + '\n')
}

await showBanner()

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')
// global.opts['db'] = process.env['db']

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))

global.DATABASE = global.db 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this)
resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
}}, 1 * 1000))
}
if (global.db.data !== null) return
global.db.READ = true
await global.db.read().catch(console.error)
global.db.READ = null
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
settings: {},
...(global.db.data || {}),
}
global.db.chain = chain(global.db.data)
}
loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache({
    stdTTL: 600, 
    checkperiod: 120, 
    maxKeys: 1000 
})
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
do {
opcion = await question(colores('₪ Elija una opción:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de texto de 8 dígitos\n--> '))

if (!/^[1-2]$/.test(opcion)) {
console.log(chalk.bold.redBright(`☞ No se permiten numeros que no sean 1 o 2, tampoco letras o símbolos especiales.`))
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
} 

console.info = () => {} 
console.debug = () => {} 

const connectionOptions = {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
    mobile: MethodMobile,
    browser: opcion == '1' ? [`${nameqr}`, 'Chrome', '120.0.0.0'] : methodCodeQR ? [`${nameqr}`, 'Chrome', '120.0.0.0'] : ['Chrome', '120.0.0.0'],
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    retryRequestDelayMs: 1000,
    qrTimeout: 40000,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    emitOwnEvents: true,
    maxQRAttempts: 3,
    markOnlineOnConnect: true,
    syncFullHistory: false,
markOnlineOnConnect: true, 
generateHighQualityLinkPreview: true, 
getMessage: async (clave) => {
let jid = jidNormalizedUser(clave.remoteJid)
let msg = await store.loadMessage(jid, clave.id)
return msg?.message || ""
},
msgRetryCounterCache,
msgRetryCounterMap,
defaultQueryTimeoutMs: undefined,
version,
}

global.conn = makeWASocket(connectionOptions);

if (!fs.existsSync(`./${sessions}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`✦ Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright(`✏  Ejemplo: 5023145xxxx`)}\n${chalk.bold.magentaBright('---> ')}`)))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}
} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
console.log(chalk.bold.white(chalk.bgMagenta(`✧ CÓDIGO DE VINCULACIÓN ✧`)), chalk.bold.white(chalk.white(codeBot)))
}, 3000)
}}}
}

conn.isInit = false;
conn.well = false;
//conn.logger.info(`✦  H E C H O\n`)

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
}, 30 * 1000);
}

// if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update;
global.stopped = connection;
if (isNewLogin) conn.isInit = true;
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error);
global.timestamp.connect = new Date;
}
if (global.db.data == null) loadDatabase();
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
console.log(chalk.bold.yellow(`\n❐ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS`))}
}
if (connection == 'open') {
console.log(chalk.bold.green('\nSe conecto a Nagibot ╰‿╯'))
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹\n┆ ⚠︎ CONEXION CERRADA, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☹`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂\n┆ ⚠︎ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ☂`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗\n┆ ⚠︎ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✗`))
} else if (reason === DisconnectReason.loggedOut) {
console.log(chalk.bold.redBright(`\n⚠︎ SIN CONEXIÓN, BORRE LA CARPETA ${global.sessions} Y ESCANEA EL CÓDIGO QR ⚠︎`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.restartRequired) {
console.log(chalk.bold.cyanBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓\n┆ ✧ CONECTANDO AL SERVIDOR...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ✓`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.timedOut) {
console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸\n┆ ⧖ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO....\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄ ▸`))
await global.reloadHandler(true).catch(console.error) //process.send('reset')
} else {
console.log(chalk.bold.redBright(`\n⚠︎！ RAZON DE DESCONEXIÓN DESCONOCIDA: ${reason || 'No encontrado'} >> ${connection || 'No encontrado'}`))
}}
}
process.on('uncaughtException', console.error)

let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e);
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}

conn.handler = handler.handler.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)

const currentDateTime = new Date()
const messageDateTime = new Date(conn.ev)
if (currentDateTime >= messageDateTime) {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])

} else {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
}

conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true);
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
else {
conn.logger.warn(`deleted plugin - '${filename}'`)
return delete global.plugins[filename]
}} else conn.logger.info(`new plugin - '${filename}'`);
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}
}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
const test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version']),
].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127);
});
}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false));
})]);
}));
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}

function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}

function purgeSession() {
let prekey = []
let directorio = readdirSync(`./${sessions}`)
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./${sessions}/${files}`)
})
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync(`./${jadi}/`);
let SBprekey = [];
listaDirectorios.forEach(directorio => {
if (statSync(`./${jadi}/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./${jadi}/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys];
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
unlinkSync(`./${jadi}/${directorio}/${fileInDir}`)
}})
}})
if (SBprekey.length === 0) {
    console.log(
        chalk.bgHex('#232946').hex('#eebbc3').bold(
            `\n╭━━━[ ${jadi} ]━━━╮\n│  ✨ Nada por eliminar. ¡Todo limpio! ✨\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻︎`
        )
    )
} else {
    console.log(
        chalk.bgHex('#232946').hex('#b8c1ec').bold(
            `\n╭━━━[ ${jadi} ]━━━╮\n│  🧹 Archivos no esenciales eliminados (${SBprekey.length})\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻︎︎`
        )
    )
}
} catch (err) {
    console.log(
        chalk.bgHex('#232946').hex('#ffadad').bold(
            `\n╭━━━[ ${jadi} ]━━━╮\n│  ⚠️ Ocurrió un error al eliminar archivos\n│  ${err}\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫✘`
        )
    )
}
}

function purgeOldFiles() {
    const directories = [`./${sessions}/`, `./${jadi}/`]
    directories.forEach(dir => {
        try {
            const files = readdirSync(dir)
            let deleted = 0
            files.forEach(file => {
                if (file !== 'creds.json') {
                    const filePath = path.join(dir, file)
                    unlinkSync(filePath)
                    deleted++
                    console.log(
                        chalk.bgHex('#232946').hex('#eebbc3').bold(
                            `\n│  🗑️ ${file} eliminado de ${dir}`
                        )
                    )
                }
            })
            if (deleted > 0) {
                console.log(
                    chalk.bgHex('#232946').hex('#b8c1ec').bold(
                        `\n╭━━━[ ${dir} ]━━━╮\n│  ✅ ${deleted} archivos residuales eliminados\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻`
                    )
                )
            } else {
                console.log(
                    chalk.bgHex('#232946').hex('#eebbc3').bold(
                        `\n╭━━━[ ${dir} ]━━━╮\n│  ✨ Nada que eliminar aquí\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻`
                    )
                )
            }
        } catch (err) {
            console.log(
                chalk.bgHex('#232946').hex('#ffadad').bold(
                    `\n╭━━━[ ${dir} ]━━━╮\n│  ⚠️ Error al limpiar archivos\n│  ${err}\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫✘`
                )
            )
        }
    })
}

function redefineConsoleMethod(methodName, filterStrings) {
    const originalConsoleMethod = console[methodName]
    console[methodName] = function() {
        const message = arguments[0]
        if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
            arguments[0] = ""
        }
        originalConsoleMethod.apply(console, arguments)
    }
}

// Limpieza periódica con mensajes cool
setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return
    await clearTmp()
    console.log(
        chalk.bgHex('#232946').hex('#b8c1ec').bold(
            `\n╭━━━[ MULTIMEDIA ]━━━╮\n│  🧹 Archivos temporales eliminados\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻`
        )
    )
}, 1000 * 60 * 4) // 4 min 

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return
    await purgeSession()
    console.log(
        chalk.bgHex('#232946').hex('#b8c1ec').bold(
            `\n╭━━━[ ${global.sessions} ]━━━╮\n│  🧹 Sesiones no esenciales eliminadas\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻`
        )
    )
}, 1000 * 60 * 10) // 10 min

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return
    await purgeSessionSB()
}, 1000 * 60 * 10) 

setInterval(async () => {
    if (stopped === 'close' || !conn || !conn.user) return
    await purgeOldFiles()
    console.log(
        chalk.bgHex('#232946').hex('#b8c1ec').bold(
            `\n╭━━━[ ARCHIVOS ]━━━╮\n│  🧹 Archivos residuales eliminados\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻`
        )
    )
}, 1000 * 60 * 10)

_quickTest().then(() => conn.logger.info(chalk.bold(`✦  H E C H O\n`.trim()))).catch(console.error)

async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}

conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
        if (reason === DisconnectReason.loggedOut) {
            console.log('Sesión cerrada, por favor elimina la carpeta sesiones y escanea nuevamente el código QR')
            process.exit()
        } else if (reason === DisconnectReason.connectionClosed) {
            console.log('Conexión cerrada, reconectando...')
            await startBot()
        } else if (reason === DisconnectReason.connectionLost) {
            console.log('Conexión perdida con el servidor, reconectando...')
            await startBot()
        } else if (reason === DisconnectReason.connectionReplaced) {
            console.log('Conexión reemplazada, se ha abierto una nueva sesión. Por favor, cierra la sesión actual primero')
            process.exit()
        } else if (reason === DisconnectReason.restartRequired) {
            console.log('Reinicio requerido, reiniciando...')
            await startBot()
        } else if (reason === DisconnectReason.timedOut) {
            console.log('Tiempo de conexión agotado, reconectando...')
            await startBot()
        } else {
            console.log(`Razón de desconexión desconocida: ${reason}|${connection}`)
        }
    } else if (connection === 'open') {
        console.log('Conexión abierta')
    }
})

conn.ev.on('creds.update', saveCreds)

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions')
    const { version } = await fetchLatestBaileysVersion()
    
    const conn = makeWASocket({
        version,
        printQRInTerminal: true,
        auth: state,
        browser: ['Nagitbot', 'Safari', '1.0.0'],
        connectTimeoutMs: 60_000,
        authTimeoutMs: 60_000,
        retryRequestDelayMs: 500,
        maxCachedMessages: 50,
        patchMessageBeforeSending: (message) => {
            return message
        },
        getMessage: async (key) => {
            return {
                conversation: ''
            }
        }
    })

    conn.isInit = false;
    conn.well = false;

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.loggedOut) {
                console.log('Sesión cerrada, por favor elimina la carpeta sesiones y escanea nuevamente el código QR')
                process.exit()
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log('Conexión cerrada, reconectando...')
                await startBot()
            } else if (reason === DisconnectReason.connectionLost) {
                console.log('Conexión perdida con el servidor, reconectando...')
                await startBot()
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log('Conexión reemplazada, se ha abierto una nueva sesión. Por favor, cierra la sesión actual primero')
                process.exit()
            } else if (reason === DisconnectReason.restartRequired) {
                console.log('Reinicio requerido, reiniciando...')
                await startBot()
            } else if (reason === DisconnectReason.timedOut) {
                console.log('Tiempo de conexión agotado, reconectando...')
                await startBot()
            } else {
                console.log(`Razón de desconexión desconocida: ${reason}|${connection}`)
            }
        } else if (connection === 'open') {
            console.log('Conexión abierta')
        }
    })

    conn.ev.on('creds.update', saveCreds)
}


const cleanupResources = () => {
    try {
  
        if (global.gc) {
            global.gc();
        }

   
        const used = process.memoryUsage();
        console.log(
            chalk.bgHex('#232946').hex('#b8c1ec').bold(
                `\n╭━━━[ MEMORIA ]━━━╮\n│  📊 Uso de memoria: ${Math.round(used.heapUsed / 1024 / 1024)}MB\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫ℹ️`
            )
        );

        if (global.conn && global.conn.chats) {
            const chats = Object.values(global.conn.chats);
            let chatCount = 0;
            
            chats.forEach(chat => {
                if (chat.messages && Object.keys(chat.messages).length > 100) {
                    chat.messages = {};
                    chatCount++;
                }
            });

            if (chatCount > 0) {
                console.log(
                    chalk.bgHex('#232946').hex('#b8c1ec').bold(
                        `\n╭━━━[ CACHÉ ]━━━╮\n│  🧹 Se limpió el caché de ${chatCount} chats\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫♻️`
                    )
                );
            }
        }
    } catch (error) {
        console.log(
            chalk.bgHex('#232946').hex('#ffadad').bold(
                `\n╭━━━[ ERROR ]━━━╮\n│  ⚠️ Error en limpieza: ${error.message}\n╰━━━━━━━━━━━━━━━━━━━━━━━⌫✘`
            )
        );
    }
};


setInterval(cleanupResources, 1000 * 60 * 30); 