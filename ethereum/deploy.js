const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const apartmentFactory = require('./build/ApartmentFactory.json');


let provider = new HDWalletProvider({
    mnemonic: {
        phrase: process.env.MNEMONIC_PHRASE
    },
    providerOrUrl: process.env.NODE
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(
        apartmentFactory.abi
    )
        .deploy({ data: apartmentFactory.evm.bytecode.object })
        .send({ gas: '10000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};
deploy().catch(console.error);
