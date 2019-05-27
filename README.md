# Mass Token Distribution Tool

Tool to create mass Ethereum transactions from CSV file. 

### Install

```npm install csv got bignumber.js@5.0.0 ethereumjs-util ethereumjs-tx```

### Configure

Edit `config.js` file. Enter your token address and its decimal places, private key of the distributing account and Etherscan API key.

Never use token owner or your personal account for token distribution. Create a new account and transfer only the amount of tokens that you want to have distributed. 

Always do a test run on Ropsten first.

### Parsing the CSV file

```
node ./parse.js sample.csv
```

Output should be something similar to:

```
Parsing...
Done!
Retrieving latest nonce...
Next nonce for 0x0000000000000000000000000000000000000000 is 42
Done. Distribution file created at ./distribution-0000-00-00T00:00:00.000Z.json
```

### Running the distribution

```
node ./distribute.js ./distribution-0000-00-00T00:00:00.000Z.json
```

The result should be something similar to:

```
0x0000000000000000000000000000000000000000 TXHASH 
0x1111111111111111111111111111111111111111 TXHASH 
0x1111111111111111111111111111111111111111 TXHASH 
0x2222222222222222222222222222222222222222 TXHASH 
0x3333333333333333333333333333333333333333 TXHASH 
0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa TXHASH 
```

### No warranties! Use at your own risk.
