import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana"
import dotenv from "dotenv"
import bs58 from "bs58"

function start () {
    dotenv.config()
    claimNFT().then()
}

async function claimNFT() {

    const privateKeyBuffer = Buffer.from(JSON.parse(process.env.PRIVATE_KEY));
    const privateKeyBase58 = bs58.encode(privateKeyBuffer);
    // 5gbQAvWmVh3FKiqR1gG9H2mdRWNCopw2DsdP2cNJdGVaKJHtpSTWUgwm2k2e1N5mt87vcmZ3o24LvvsBUbqXnF1Z
    // 3sFSZjuNZiQrogWKgwYyXPQ6LRihXELM5GnL2hFCiQ5mknLfHL7ErnGDxFU8bkAJYYeiGtAVkGdeSLA2Rz28nJR4

    const sdk = ThirdwebSDK.fromPrivateKey("mainnet-beta", privateKeyBase58)
    const program = await sdk.getProgram(process.env.CONTRACT_ADDRESS, "nft-drop");

    const YEAR = Number(process.env.YEAR)
    const MONTH = Number(process.env.MONTH) - 1
    const DAY = Number(process.env.DAY)
    const HOUR = Number(process.env.HOUR)
    const MINUTE = Number(process.env.MINUTE)
    const SECOND = Number(process.env.SECOND)

    const startTime = new Date(YEAR, MONTH, DAY, HOUR, MINUTE, SECOND, 0).getTime()
    let currentTime = new Date().getTime()

    if (startTime > currentTime) {
        console.log("Waiting for start...")
    }

    let cycle = true

    while (cycle) {
        let currentTime = new Date().getTime()
        console.log(startTime - currentTime)
        if (currentTime >= startTime) {
            program.claimTo(process.env.WALLET_ADDRESS, 1).then(claimedAddresses => {
                console.log(claimedAddresses)
                cycle = false
            })
        }
    }
}

start()