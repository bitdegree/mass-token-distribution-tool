const fs = require('fs');
const csv = require('csv');
const got = require('got');
const config = require('./config.js');
const BigNumber = require('bignumber.js');
const EthereumUtil = require('ethereumjs-util');

if(typeof process.argv[2] !== 'string') {
    return console.error('Please specify the source CSV file.');
}

var file = process.argv[2];

try {
    var toTransfer = {};
    var contents = fs.readFileSync(file).toString();

    csv.parse(contents, function(err, columns) {
        if(err) {
            throw err;
        }

        console.log('Parsing...');

        columns.forEach(function (t) {
            if(t.length < 2) {
                throw "Must have at least two columns";
            }
            if(typeof toTransfer[t[0]] !== 'undefined') {
                toTransfer[t[0]].value = toTransfer[t[0]].value.add(t[1]);
            } else {
                toTransfer[t[0]] = {
                    address: t[0],
                    value: new BigNumber(t[1]),
                    nonce: null
                };
            }
        });

        toTransfer = Object.values(toTransfer);

        toTransfer.map(function (t) {
            t.abiValue =
                '0xa9059cbb' // transfer
                + t.address.substr(2).padStart(64, "0")
                + t.value.mul((new BigNumber(10)).pow(config.tokenSymbols)).toString(16).padStart(64, "0");
            return t;
        });

        console.log('Done!');

        // Retrieve last nonce

        console.log('Retrieving latest nonce...');

        var address = '0x' + EthereumUtil.privateToAddress(config.privateKey.length === 64 ? '0x' + config.privateKey : config.privateKey).toString('hex');
        var nonce = null;

        got.get(config.etherscanApiUrl, {
            query: {
                module: 'proxy',
                action: 'eth_getTransactionCount',
                address: address,
                apikey: config.etherscanToken
            }
        }).on('error', function (e, b, r) {
            console.error('Failed to retrieve transaction count', t, e, b);
        }).then(function (response) {
            var body = JSON.parse(response.body);
            if(body.error) {
                console.error('Failed to retrieve transaction count', body);
                return;
            }

            nonce = new BigNumber(body.result || 0);
            console.log('Next nonce for ' + address +  ' is ' + nonce);

            toTransfer.map(function (t) {
                t.nonce = nonce.toFixed();
                t.value = t.value.toFixed();
                nonce = nonce.add(1);
                return t;
            });

            var filename = './distribution-' + (new Date()).toISOString() + '.json';

            fs.writeFile(filename, JSON.stringify(toTransfer), function (err) {
                if(err) {
                    return console.error(err);
                }

                console.log('Done. Distribution file created at ' + filename);
            });
        });
    });

} catch (e) {
    console.log('Could not read the given file: ' +  e.message);
}