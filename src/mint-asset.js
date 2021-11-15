const cardano = require("./main")

const wallet = cardano.wallet("cardano")

const mintScript = {
    hash: cardano.addressKeyHash(wallet.name),
    type: "ada"
}

const ID = cardano.transactionPolicyid(mintScript)


const ASSET_NAME = "Eric cardano"

const ASSET_ID = ID + "." + ASSET_NAME


const metadata = {
    1155: {
        [ID]: {
            [ASSET_NAME]: {
                name: ASSET_NAME,
                image: "ipfs://NKtoPmC9jvnmQqzMTa12WPT3gkSEQvQgT4f4T5v6PWBp7X",
                description: "Deploying cardano NFT",
                type: "image/png",
                src: "ipfs://NKtoPmC9jvnmQqzMTa12WPT3gkSEQvQgT4f4T5v6PWBp7X",
                // other properties of your choice
                authors: ["Aim ", "Achieve"]
            }
        }
    }
}


const tranaction = {
    tranactionIn: wallet.balance().utranactiono,
    tranactionOut: [
        {
            address: wallet.paymentAddr,
            value: { ...wallet.balance().value, [ASSET_ID]: 1 }
        }
    ],
    mint: {
        actions: [{ type: "mint", quantity: 10000, asset: ASSET_ID }],
        script: [mintScript]
    },
    metadata,
    witnessCount: 10000
}

const buildingNFT = (tranaction) => {

    const raw = cardano.transactionBuildRaw(tranaction)
    const fee = cardano.transactionCalculateMinFee({
        ...tranaction,
        tranactionBody: raw
    })

    tranaction.tranactionOut[0].value.lovelace -= fee

    return cardano.transactionBuildRaw({ ...tranaction, fee })
}

const raw = buildTransaction(tranaction)


const signNFT = (wallet, tranaction) => {

    return cardano.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        tranactionBody: tranaction
    })
}

const loggedIn = signTransaction(wallet, raw)


const tranactionHash = cardano.transactionSubmit(loggedIn)
