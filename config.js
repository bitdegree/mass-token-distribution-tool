module.exports = {
    // Ethereum Network ID used to sign transactions
    // 1 - Main Net
    // 3 - Ropsten
    networkId: 3,

    // Private key of an account that will be used to distribute tokens
    // Always create a new account for token distribution.
    // Transfer only the amount of tokens that need to be distributed and some ETH for gas
    privateKey: '0000000000000000000000000000000000000000000000000000000000000000',

    // Address of the token that will be distributed
    tokenAddress: '0x00000000000000000000000000000000',

    // Specify how many decimal places the token has.
    // This is important! Setting this to an incorrect value could result in incorrect amounts sent.
    tokenSymbols: 18,

    // Gas price (in gwei) to use when transferring
    gasPrice: 40,

    // Gas limit
    gasLimit: 60000,

    // Etherscan API key
    // Sign up on etherscan.io and generate a free API token
    etherscanToken: '',

    // Etherscan API url
    etherscanApiUrl: 'https://ropsten.etherscan.io/api' // Ropsten
    // etherscanApiUrl: 'https://api.etherscan.io/api' // Main net
};