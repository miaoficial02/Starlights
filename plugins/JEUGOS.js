
//▪CÓDIGO BY YO SOY YO▪
//▪ROXY BOT MD▪

import TicTacToe from '../lib/tictactoe.js'

// Datos globales para los juegos
global.gameData = global.gameData || {}

let handler = async (m, { conn, args, usedPrefix, command, participants }) => {
    let game = command.toLowerCase()
    let mode = args[0]?.toLowerCase()
    let user = global.db.data.users[m.sender]
    
    if (!user) {
        user = global.db.data.users[m.sender] = {
            wins: 0,
            losses: 0,
            draws: 0
        }
    }

    switch (game) {
        case 'tictactoe':
        case 'ttt':
            return await playTicTacToe(m, conn, args, usedPrefix)
            
        case 'piedrapapeltijera':
        case 'ppt':
            return await playRockPaperScissors(m, conn, args, usedPrefix)
            
        case 'adivinanum':
            return await playGuessNumber(m, conn, args, usedPrefix)
            
        case 'matematicas':
        case 'mate':
            return await playMath(m, conn, args, usedPrefix)
            
        case 'ahorcado':
            return await playHangman(m, conn, args, usedPrefix)
            
        case 'memoria':
            return await playMemory(m, conn, args, usedPrefix)
            
        case 'simon':
            return await playSimon(m, conn, args, usedPrefix)
            
        case 'anagrama':
            return await playAnagram(m, conn, args, usedPrefix)
            
        case 'blackjack':
        case 'bj':
            return await playBlackjack(m, conn, args, usedPrefix)
            
        case 'guerra':
            return await playWar(m, conn, args, usedPrefix)
            
        default:
            return await showGameMenu(m, conn, usedPrefix)
    }
}

// Menú principal de juegos
async function showGameMenu(m, conn, usedPrefix) {
    let menu = `
🎮 *CENTRO DE JUEGOS ROXY* 🎮

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🎯 *JUEGOS DISPONIBLES*
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 🎪 \`${usedPrefix}tictactoe\` - Tres en raya
┃ ✂️ \`${usedPrefix}ppt\` - Piedra, papel o tijera
┃ 🔢 \`${usedPrefix}adivinanum\` - Adivina el número
┃ ➗ \`${usedPrefix}mate\` - Matemáticas rápidas
┃ 🎪 \`${usedPrefix}ahorcado\` - Juego del ahorcado
┃ 🧠 \`${usedPrefix}memoria\` - Juego de memoria
┃ 🔄 \`${usedPrefix}simon\` - Simon dice
┃ 📝 \`${usedPrefix}anagrama\` - Anagramas
┃ 🃏 \`${usedPrefix}blackjack\` - Blackjack
┃ ⚔️ \`${usedPrefix}guerra\` - Guerra de cartas
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🎯 *MODOS DE JUEGO*
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
┃ 🤖 \`auto\` - Jugar contra la IA
┃ 👥 \`1v1 @usuario\` - Jugar contra otro usuario
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Ejemplo:* ${usedPrefix}ttt auto
*Ejemplo:* ${usedPrefix}ppt 1v1 @${m.sender.split('@')[0]}
`
    
    await conn.reply(m.chat, menu, m)
}

// 1. Tres en Raya
async function playTicTacToe(m, conn, args, usedPrefix) {
    let gameId = m.chat
    let mode = args[0]?.toLowerCase()
    
    if (!mode) {
        return conn.reply(m.chat, `🎪 *TRES EN RAYA*\n\n• \`${usedPrefix}ttt auto\` - Jugar contra IA\n• \`${usedPrefix}ttt 1v1 @usuario\` - Jugar contra usuario`, m)
    }
    
    if (mode === 'auto') {
        // Jugar contra IA
        let game = new TicTacToe(m.sender, 'IA')
        global.gameData[gameId] = {
            game: game,
            type: 'ttt',
            mode: 'auto',
            player1: m.sender,
            turn: m.sender
        }
        
        let board = game.render().map((v, i) => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
                4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
                7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
            }[v]
        })
        
        let str = `🎪 *TRES EN RAYA VS IA*

${board.slice(0, 3).join('')}
${board.slice(3, 6).join('')}
${board.slice(6, 9).join('')}

Turno de: @${m.sender.split('@')[0]}
Escribe un número del 1-9 para jugar`

        await conn.reply(m.chat, str, m, { mentions: [m.sender] })
        
    } else if (mode === '1v1') {
        let opponent = m.mentionedJid[0]
        if (!opponent) {
            return conn.reply(m.chat, '❌ Debes mencionar a un usuario para jugar 1v1', m)
        }
        
        let game = new TicTacToe(m.sender, opponent)
        global.gameData[gameId] = {
            game: game,
            type: 'ttt',
            mode: '1v1',
            player1: m.sender,
            player2: opponent,
            turn: m.sender
        }
        
        let board = game.render().map((v, i) => {
            return {
                X: '❌',
                O: '⭕',
                1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
                4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
                7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
            }[v]
        })
        
        let str = `🎪 *TRES EN RAYA 1V1*

${board.slice(0, 3).join('')}
${board.slice(3, 6).join('')}
${board.slice(6, 9).join('')}

👤 Jugador 1: @${m.sender.split('@')[0]} (❌)
👤 Jugador 2: @${opponent.split('@')[0]} (⭕)

Turno de: @${m.sender.split('@')[0]}
Escribe un número del 1-9 para jugar`

        await conn.reply(m.chat, str, m, { mentions: [m.sender, opponent] })
    }
}

// 2. Piedra, Papel o Tijera
async function playRockPaperScissors(m, conn, args, usedPrefix) {
    let mode = args[0]?.toLowerCase()
    let choice = args[1]?.toLowerCase()
    
    if (!mode) {
        return conn.reply(m.chat, `✂️ *PIEDRA, PAPEL O TIJERA*\n\n• \`${usedPrefix}ppt auto piedra/papel/tijera\`\n• \`${usedPrefix}ppt 1v1 @usuario\``, m)
    }
    
    if (mode === 'auto') {
        if (!choice || !['piedra', 'papel', 'tijera'].includes(choice)) {
            return conn.reply(m.chat, '❌ Elige: piedra, papel o tijera', m)
        }
        
        let choices = ['piedra', 'papel', 'tijera']
        let botChoice = choices[Math.floor(Math.random() * choices.length)]
        let userChoice = choice
        
        let result = ''
        if (userChoice === botChoice) {
            result = '🤝 ¡Empate!'
            global.db.data.users[m.sender].draws++
        } else if (
            (userChoice === 'piedra' && botChoice === 'tijera') ||
            (userChoice === 'papel' && botChoice === 'piedra') ||
            (userChoice === 'tijera' && botChoice === 'papel')
        ) {
            result = '🎉 ¡Ganaste!'
            global.db.data.users[m.sender].wins++
        } else {
            result = '😔 ¡Perdiste!'
            global.db.data.users[m.sender].losses++
        }
        
        let emojis = { piedra: '🗿', papel: '📄', tijera: '✂️' }
        
        await conn.reply(m.chat, `✂️ *PIEDRA, PAPEL O TIJERA*

Tu elección: ${emojis[userChoice]} ${userChoice}
IA eligió: ${emojis[botChoice]} ${botChoice}

${result}`, m)
        
    } else if (mode === '1v1') {
        let opponent = m.mentionedJid[0]
        if (!opponent) {
            return conn.reply(m.chat, '❌ Debes mencionar a un usuario para jugar 1v1', m)
        }
        
        let gameId = m.chat + '_ppt'
        global.gameData[gameId] = {
            type: 'ppt',
            mode: '1v1',
            player1: m.sender,
            player2: opponent,
            choices: {},
            waiting: true
        }
        
        await conn.reply(m.chat, `✂️ *PIEDRA, PAPEL O TIJERA 1V1*

👤 @${m.sender.split('@')[0]} vs @${opponent.split('@')[0]}

Ambos jugadores deben enviar su elección por privado al bot:
- piedra
- papel  
- tijera`, m, { mentions: [m.sender, opponent] })
    }
}

// 3. Adivina el número
async function playGuessNumber(m, conn, args, usedPrefix) {
    let mode = args[0]?.toLowerCase()
    
    if (!mode) {
        return conn.reply(m.chat, `🔢 *ADIVINA EL NÚMERO*\n\n• \`${usedPrefix}adivinanum auto\` - Adivina el número (1-100)\n• \`${usedPrefix}adivinanum 1v1 @usuario\` - Competencia`, m)
    }
    
    if (mode === 'auto') {
        let gameId = m.chat + '_guess'
        let number = Math.floor(Math.random() * 100) + 1
        
        global.gameData[gameId] = {
            type: 'guess',
            mode: 'auto',
            player: m.sender,
            number: number,
            attempts: 0,
            maxAttempts: 7
        }
        
        await conn.reply(m.chat, `🔢 *ADIVINA EL NÚMERO*

He pensado un número entre 1 y 100
Tienes 7 intentos para adivinarlo

¡Escribe tu primer número!`, m)
        
    } else if (mode === '1v1') {
        let opponent = m.mentionedJid[0]
        if (!opponent) {
            return conn.reply(m.chat, '❌ Debes mencionar a un usuario', m)
        }
        
        let gameId = m.chat + '_guess1v1'
        let number = Math.floor(Math.random() * 100) + 1
        
        global.gameData[gameId] = {
            type: 'guess1v1',
            mode: '1v1',
            player1: m.sender,
            player2: opponent,
            number: number,
            attempts: { [m.sender]: 0, [opponent]: 0 },
            turn: m.sender
        }
        
        await conn.reply(m.chat, `🔢 *ADIVINA EL NÚMERO 1V1*

👤 @${m.sender.split('@')[0]} vs @${opponent.split('@')[0]}

Número entre 1 y 100
Turno de: @${m.sender.split('@')[0]}`, m, { mentions: [m.sender, opponent] })
    }
}

// 4. Matemáticas rápidas
async function playMath(m, conn, args, usedPrefix) {
    let mode = args[0]?.toLowerCase()
    
    if (!mode) {
        return conn.reply(m.chat, `➗ *MATEMÁTICAS RÁPIDAS*\n\n• \`${usedPrefix}mate auto\` - Resolver operaciones\n• \`${usedPrefix}mate 1v1 @usuario\` - Competencia`, m)
    }
    
    let operations = ['+', '-', '*']
    let operation = operations[Math.floor(Math.random() * operations.length)]
    let num1 = Math.floor(Math.random() * 50) + 1
    let num2 = Math.floor(Math.random() * 50) + 1
    
    if (operation === '*') {
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
    }
    
    let answer = eval(`${num1} ${operation} ${num2}`)
    
    if (mode === 'auto') {
        let gameId = m.chat + '_math'
        
        global.gameData[gameId] = {
            type: 'math',
            mode: 'auto',
            player: m.sender,
            answer: answer,
            startTime: Date.now()
        }
        
        await conn.reply(m.chat, `➗ *MATEMÁTICAS RÁPIDAS*

¿Cuánto es?
**${num1} ${operation} ${num2} = ?**

¡Responde lo más rápido posible!`, m)
        
    } else if (mode === '1v1') {
        let opponent = m.mentionedJid[0]
        if (!opponent) {
            return conn.reply(m.chat, '❌ Debes mencionar a un usuario', m)
        }
        
        let gameId = m.chat + '_math1v1'
        
        global.gameData[gameId] = {
            type: 'math1v1',
            mode: '1v1',
            player1: m.sender,
            player2: opponent,
            answer: answer,
            startTime: Date.now(),
            answered: false
        }
        
        await conn.reply(m.chat, `➗ *MATEMÁTICAS RÁPIDAS 1V1*

👤 @${m.sender.split('@')[0]} vs @${opponent.split('@')[0]}

¿Cuánto es?
**${num1} ${operation} ${num2} = ?**

¡El primero en responder gana!`, m, { mentions: [m.sender, opponent] })
    }
}

// 5. Ahorcado
async function playHangman(m, conn, args, usedPrefix) {
    let mode = args[0]?.toLowerCase()
    
    if (!mode) {
        return conn.reply(m.chat, `🎪 *JUEGO DEL AHORCADO*\n\n• \`${usedPrefix}ahorcado auto\` - Adivina la palabra\n• \`${usedPrefix}ahorcado 1v1 @usuario\` - Competencia`, m)
    }
    
    let words = [
        'JAVASCRIPT', 'PYTHON', 'WHATSAPP', 'TELEGRAM', 'DISCORD',
        'ROXY', 'BAILEYS', 'NODE', 'GITHUB', 'REPLIT',
        'CODIGO', 'PROGRAMAR', 'DESARROLLO', 'TECNOLOGIA', 'COMPUTADORA'
    ]
    
    let word = words[Math.floor(Math.random() * words.length)]
    let guessed = '_'.repeat(word.length).split('')
    
    if (mode === 'auto') {
        let gameId = m.chat + '_hangman'
        
        global.gameData[gameId] = {
            type: 'hangman',
            mode: 'auto',
            player: m.sender,
            word: word,
            guessed: guessed,
            wrongGuesses: [],
            maxWrong: 6
        }
        
        await conn.reply(m.chat, `🎪 *JUEGO DEL AHORCADO*

Palabra: ${guessed.join(' ')}
Letras incorrectas: 
Intentos restantes: 6

Escribe una letra para adivinar`, m)
        
    } else if (mode === '1v1') {
        let opponent = m.mentionedJid[0]
        if (!opponent) {
            return conn.reply(m.chat, '❌ Debes mencionar a un usuario', m)
        }
        
        let gameId = m.chat + '_hangman1v1'
        
        global.gameData[gameId] = {
            type: 'hangman1v1',
            mode: '1v1',
            player1: m.sender,
            player2: opponent,
            word: word,
            guessed: guessed,
            wrongGuesses: [],
            turn: m.sender,
            maxWrong: 6
        }
        
        await conn.reply(m.chat, `🎪 *AHORCADO 1V1*

👤 @${m.sender.split('@')[0]} vs @${opponent.split('@')[0]}

Palabra: ${guessed.join(' ')}
Turno de: @${m.sender.split('@')[0]}
Escribe una letra`, m, { mentions: [m.sender, opponent] })
    }
}

// 6-10: Resto de juegos simplificados
async function playMemory(m, conn, args, usedPrefix) {
    await conn.reply(m.chat, '🧠 *JUEGO DE MEMORIA*\n\nMemoriza esta secuencia:\n🔴🔵🟡🟢\n\nRepite la secuencia escribiendo los colores', m)
}

async function playSimon(m, conn, args, usedPrefix) {
    await conn.reply(m.chat, '🔄 *SIMON DICE*\n\nSimon dice: "Salta"\n\nEscribe lo que Simon dice para continuar', m)
}

async function playAnagram(m, conn, args, usedPrefix) {
    let words = ['ROXY', 'BOT', 'WHATSAPP', 'JUEGO']
    let word = words[Math.floor(Math.random() * words.length)]
    let scrambled = word.split('').sort(() => Math.random() - 0.5).join('')
    await conn.reply(m.chat, `📝 *ANAGRAMA*\n\nReordena las letras: **${scrambled}**\n\n¿Qué palabra es?`, m)
}

async function playBlackjack(m, conn, args, usedPrefix) {
    await conn.reply(m.chat, '🃏 *BLACKJACK*\n\nTus cartas: 7♠️ K♦️ (17)\nCarta del dealer: A♣️\n\n¿Pedir carta o plantarse? (carta/plantar)', m)
}

async function playWar(m, conn, args, usedPrefix) {
    await conn.reply(m.chat, '⚔️ *GUERRA DE CARTAS*\n\nTu carta: K♠️\nCarta rival: Q♦️\n\n¡Ganaste esta ronda!', m)
}

// Handler para respuestas de juegos
export async function before(m, { conn }) {
    if (m.isBaileys && m.fromMe) return !0
    if (!m.text) return !0
    
    let gameId = m.chat
    let gameData = global.gameData[gameId] || global.gameData[gameId + '_guess'] || global.gameData[gameId + '_math'] || global.gameData[gameId + '_hangman']
    
    if (!gameData) return !0
    
    // Manejar respuestas del Tres en Raya
    if (gameData.type === 'ttt') {
        if (gameData.mode === 'auto' && m.sender === gameData.player1) {
            let pos = parseInt(m.text)
            if (pos >= 1 && pos <= 9) {
                let result = gameData.game.turn(0, pos - 1)
                if (result === 1) {
                    // Turno de la IA
                    let available = []
                    for (let i = 0; i < 9; i++) {
                        if (!(gameData.game.board & (1 << i))) available.push(i)
                    }
                    let aiMove = available[Math.floor(Math.random() * available.length)]
                    gameData.game.turn(1, aiMove)
                    
                    let board = gameData.game.render().map((v, i) => {
                        return {
                            X: '❌', O: '⭕',
                            1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
                            4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
                            7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
                        }[v]
                    })
                    
                    let winner = gameData.game.winner
                    if (winner) {
                        let result = winner === gameData.player1 ? '🎉 ¡Ganaste!' : '😔 ¡Perdiste contra la IA!'
                        await conn.reply(m.chat, `${board.slice(0, 3).join('')}\n${board.slice(3, 6).join('')}\n${board.slice(6, 9).join('')}\n\n${result}`, m)
                        delete global.gameData[gameId]
                    } else if (gameData.game.board === 511) {
                        await conn.reply(m.chat, `${board.slice(0, 3).join('')}\n${board.slice(3, 6).join('')}\n${board.slice(6, 9).join('')}\n\n🤝 ¡Empate!`, m)
                        delete global.gameData[gameId]
                    } else {
                        await conn.reply(m.chat, `${board.slice(0, 3).join('')}\n${board.slice(3, 6).join('')}\n${board.slice(6, 9).join('')}\n\nTu turno, escribe un número`, m)
                    }
                }
            }
        }
    }
    
    // Manejar respuestas del juego de adivinanza
    if (gameData.type === 'guess' && m.sender === gameData.player) {
        let guess = parseInt(m.text)
        if (!isNaN(guess)) {
            gameData.attempts++
            
            if (guess === gameData.number) {
                await conn.reply(m.chat, `🎉 ¡Correcto! El número era ${gameData.number}\nIntentos: ${gameData.attempts}`, m)
                global.db.data.users[m.sender].wins++
                delete global.gameData[gameId + '_guess']
            } else if (gameData.attempts >= gameData.maxAttempts) {
                await conn.reply(m.chat, `😔 ¡Se acabaron los intentos! El número era ${gameData.number}`, m)
                global.db.data.users[m.sender].losses++
                delete global.gameData[gameId + '_guess']
            } else {
                let hint = guess < gameData.number ? 'mayor' : 'menor'
                await conn.reply(m.chat, `${guess < gameData.number ? '📈' : '📉'} El número es ${hint}\nIntentos restantes: ${gameData.maxAttempts - gameData.attempts}`, m)
            }
        }
    }
    
    // Manejar respuestas de matemáticas
    if (gameData.type === 'math' && m.sender === gameData.player) {
        let answer = parseInt(m.text)
        if (answer === gameData.answer) {
            let time = ((Date.now() - gameData.startTime) / 1000).toFixed(2)
            await conn.reply(m.chat, `🎉 ¡Correcto! Tiempo: ${time} segundos`, m)
            global.db.data.users[m.sender].wins++
            delete global.gameData[gameId + '_math']
        } else if (!isNaN(answer)) {
            await conn.reply(m.chat, `❌ Incorrecto. La respuesta era ${gameData.answer}`, m)
            global.db.data.users[m.sender].losses++
            delete global.gameData[gameId + '_math']
        }
    }
    
    return !0
}

handler.help = ['juegos', 'tictactoe', 'ppt', 'adivinanum', 'mate', 'ahorcado', 'memoria', 'simon', 'anagrama', 'blackjack', 'guerra']
handler.tags = ['juegos']
handler.command = /^(juegos|tictactoe|ttt|piedrapapeltijera|ppt|adivinanum|matematicas|mate|ahorcado|memoria|simon|anagrama|blackjack|bj|guerra)$/i

export default handler
