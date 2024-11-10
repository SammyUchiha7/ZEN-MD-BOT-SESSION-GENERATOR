const PastebinAPI = require('pastebin-js'),
      pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

// Helper function to remove files
function removeFile(FilePath){
    if(!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
};

// Generate a random session ID with the format: ZEN-MD-BOT: randomPart
function generateSessionId() {
    const randomPart = makeid(6);  // You can adjust the length as needed
    return `ZEN-MD-BOT: ${randomPart}`;
}

router.get('/', async (req, res) => {
    const sessionId = generateSessionId();  // Generate the custom session ID
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${sessionId}`);
        
        try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: ["Chrome (Linux)", "", ""]
            });

            if(!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g,'');
                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);

                if(!res.headersSent) {
                    await res.send({code});
                }
            }

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection == "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${sessionId}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: '' + b64data });

                    let GIFTED_MD_TEXT = `
ZEN-MD-BOT SESSION IS 
SUCCESSFULLY
CONNECTED ✅
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❶ Creator = 𖥘 MX-GΔMΞCØDΞR 𖥘
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❷ WhattsApp Channel = https://chat.whatsapp.com/F2JwN4RBlVABhbbEHabGDT
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Please Follow My Support Channel
Wanna talk to me?👉 https://t.me/Botdeveloperking👈
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
©*2024-2099 MX-GΔMΞCØDΞR*

_Don't Forget To Give Star To My Repo_`;

                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: GIFTED_MD_TEXT }, { quoted: session });
                    
                    await delay(100);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    return await removeFile(`./temp/${sessionId}`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted due to error:", err);
            await removeFile(`./temp/${sessionId}`);
            if (!res.headersSent) {
                await res.send({code: "Service Unavailable"});
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
