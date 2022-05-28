const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const apartmentPath = path.resolve(__dirname, "contracts");
const fileNames = fs.readdirSync(apartmentPath);

const input = {
    language: 'Solidity',
    sources: fileNames.reduce((input, fileName) => {
        const filePath = path.resolve(apartmentPath, fileName);
        const source = fs.readFileSync(filePath, "utf8");
        return { ...input, [fileName]: { content: source } };
    }, {}),
    settings: {
        outputSelection: {
            '*': {
                '*': ["abi", "evm.bytecode.object"]
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

fileNames.map((fileName) => {
    const contracts = Object.keys(output.contracts[fileName]);
    contracts.map((contract) => {
        fs.outputJsonSync(
            path.resolve(buildPath, contract + ".json"),
            output.contracts[fileName][contract]
        );
    });
});
