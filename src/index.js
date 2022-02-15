const { CHAINS, Account, MnemonicKey, AnchorEarn, NETWORKS, DENOMS } = require('@anchor-protocol/anchor-earn');
const { LCDClient, Wallet } = require('@terra-money/terra.js');
const express = require('express')
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require('cors');
const urlencodedParser = bodyParser.urlencoded({ extended: false })  
const app = express()

app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

// Ready to go!
app.get('/create-wallet', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const account = new Account(CHAINS.TERRA);

    res.json({
        privateKey: account.privateKey,
        secretWords: account.mnemonic,
        walletAddress: account.accAddress,
    });
})

// Ready to go!
app.post('/recover-wallet', urlencodedParser, function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const { mnemonicWords } = req.query;

    const account = new MnemonicKey({
        mnemonic: mnemonicWords,
    });

    res.json({
        privateKey: account.privateKey,
        walletAddress: account.accAddress
    });
});

// Ready to go!
app.post('/deposit-crypto', urlencodedParser, async function (req, res) {  
    const { privateKey, amount, currency = DENOMS.UST} = req.body;

    const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.COLUMBUS_5,
        privateKey: privateKey.data,
    });

    const depositResponse = await anchorEarn.deposit({
        amount: amount,
        currency: currency,
    });

    res.end(JSON.stringify(depositResponse));  
})  

// Ready to go!
app.post('/withdraw-crypto', urlencodedParser, async function (req, res) {  
    const { privateKey, amount, currency = DENOMS.UST} = req.body;

    const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.COLUMBUS_5,
        privateKey: privateKey.data,
    });

    try{
        const withdrawResponse = await anchorEarn.withdraw({
            amount: amount,
            currency:currency,
        });
        console.log(withdrawResponse);  
        res.end(JSON.stringify(withdrawResponse));  
    } catch (e)  {
        console.log(e.message );
    }
    
}) 

// Ready to go!
app.post('/transfer-crypto', urlencodedParser, async function (req, res) {  
    const { privateKey, amount, walletTarget, currency = DENOMS.UST } = req.body;

    const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.COLUMBUS_5,
        privateKey: privateKey.data,
    });

    const response = await anchorEarn.send({
        currency: currency,
        recipient: walletTarget,
        amount: amount
    });
    
    console.log(response);
    res.end(JSON.stringify(response));  
}) 

// Ready to go!
app.post('/wallet-balance', urlencodedParser, async function (req, res) {  
    const { privateKey } = req.body;

    const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.COLUMBUS_5,
        privateKey: privateKey.data,
    });

    const userBalance = await anchorEarn.balance({
        currencies: [DENOMS.UST],
    });   
    
    console.log(userBalance);
    res.end(JSON.stringify(userBalance));
});

app.post('/market-information', urlencodedParser, async function (req, res) {  
    const { privateKey } = req.body;

    const anchorEarn = new AnchorEarn({
        chain: CHAINS.TERRA,
        network: NETWORKS.COLUMBUS_5,
        privateKey: privateKey.data,
    });

    const userBalance = await anchorEarn.market({
        currencies: [DENOMS.UST],
    });   
    
    console.log(userBalance);
    res.end(JSON.stringify(userBalance));
});

app.listen(3000)

/**
 * 
 * {"type":"Buffer","data":[92,108,237,207,60,241,35,162,203,212,113,238,105,70,197,237,114,146,4,161,233,77,35,100,68,120,143,74,222,178,105,218]}
 * orchard antique annual car trophy rent picnic extra cheese auction column rate virtual destroy talent spider school make assist process badge summer hour ordinary
 * terra1uhz4zz6gexhzxzeqdc2mejt00nrmlkdng9gmjs
 *
 * */