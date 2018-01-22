var BigNumber = require('bignumber.js');
var EthereumTx = require('ethereumjs-tx');
var got = require('got');
var fs = require('fs');

var config = require('./config.js');

var privateKey = Buffer.from(config.privateKey, 'hex');

String.prototype.padStart = function (amount, symbol) {
    var length = this.length;
    var symbols = length > amount ? 0 : amount - length;
    return symbol.repeat(symbols) + this;
};

if(typeof process.argv[2] !== 'string') {
    return console.error('Could not open distribution file');
}

var contents = fs.readFileSync(process.argv[2]);
var toTransfer = JSON.parse(contents);


if((toTransfer.length || 0) === 0) {
    return console.error('File is either malformed or contains no transfers.');
}

makeTransfer(toTransfer.shift());

function makeTransfer(t) {
    const txParams = {
        nonce: toHex(t.nonce),
        gasPrice: toHex((new BigNumber(10)).pow(9).mul(config.gasPrice)),
        gasLimit: toHex(config.gasLimit),
        to: config.tokenAddress,
        value: toHex(0),
        data: t.abiValue,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: config.networkId
    };

    const tx = new EthereumTx(txParams);
    tx.sign(privateKey);

    var signedData = tx.serialize().toString('hex');

    got.get(config.etherscanApiUrl, {
        query: {
            module: 'proxy',
            action: 'eth_sendRawTransaction',
            hex: signedData,
            apikey: config.etherscanToken
        }
    }).on('error', function (e, b, r) {
        console.error('failed', t, e, b);
    }).then(function (response) {
        var data = JSON.parse(response.body);
        if(data.error) {
            console.error(t, data.error);
        }else {
            console.log(t.address, data.result, 'OK');
        }
        if(toTransfer.length > 0) {
            makeTransfer(toTransfer.shift());
        }
    })
}

function toHex(input, padding) {
    return '0x' + (new BigNumber(input)).toString(16).padStart(padding || 0, "0");
}