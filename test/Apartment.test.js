const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({gasLimit: 8000000000}));

const compiledFactory = require('../ethereum/build/ApartmentFactory.json');
const compiledApartment = require('../ethereum/build/Apartment.json');

let accounts;
let factory;
let apartmentAddress;
let apartment;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({data: compiledFactory.evm.bytecode.object})
        .send({from: accounts[0], gas: '10000000'});

    await factory.methods.createApartment([], 'USA', 'New York', 'Description', 300).send({
        from: accounts[0],
        gas: '10000000'
    });

    [apartmentAddress] = await factory.methods.getDeployedApartments().call();
    apartment = await new web3.eth.Contract(
        compiledApartment.abi,
        apartmentAddress
    );
});

describe('Apartments', () => {
    it('deploys a factory and a apartment', () => {
        assert.ok(factory.options.address);
        assert.ok(apartment.options.address);
    });

    it('marks caller as the apartment landlord', async () => {
        const owner = await apartment.methods.landlord().call();
        assert.equal(accounts[0], owner);
    });

    it('allow tenant rent an apartment, reserved dates and add to tenant balance', async () => {
        let today = new Date()
        let tomorrow =  new Date()
        tomorrow.setDate(today.getDate() + 1)
        let dayAfterTomorrow =  new Date()
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        today = Date.parse(today)
        tomorrow = Date.parse(tomorrow)
        dayAfterTomorrow = Date.parse(dayAfterTomorrow)

        await apartment.methods.rent([today, tomorrow, dayAfterTomorrow])
            .send({value: '900', from: accounts[1], gas: '100000000'});

        const firstDateOfRent = await apartment.methods.dateAvailableForRent(today).call();
        const tenantFirstDateRent = await apartment.methods.tenantFirstDateRent(accounts[1]).call();
        const tenantBalance = await apartment.methods.tenantBalance(accounts[1]).call();

        assert.equal(accounts[1], firstDateOfRent);
        assert.equal(today, tenantFirstDateRent);
        assert.equal('900', tenantBalance);
    });

    it('try to rent apartment but send not enough or too much money', async () => {
        let today = new Date()
        let tomorrow =  new Date()
        tomorrow.setDate(today.getDate() + 1)
        let dayAfterTomorrow =  new Date()
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        today = Date.parse(today)
        tomorrow = Date.parse(tomorrow)
        dayAfterTomorrow = Date.parse(dayAfterTomorrow)

        let executed;
        try {
            await apartment.methods.rent([today, tomorrow, dayAfterTomorrow])
                .send({value: '80', from: accounts[0], gas: '100000000'});
            executed = 'success';
        } catch (e) {
            executed = 'fail';
        }

        assert.equal('fail', executed);
    });

    it('rent apartment and pay for it', async () => {
        let today = new Date()
        let tomorrow =  new Date()
        tomorrow.setDate(today.getDate() + 1)
        let dayAfterTomorrow =  new Date()
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        today = Date.parse(today)
        tomorrow = Date.parse(tomorrow)
        dayAfterTomorrow = Date.parse(dayAfterTomorrow)

        let balance = await web3.eth.getBalance(accounts[0]);

        await apartment.methods.rent([today, tomorrow, dayAfterTomorrow])
            .send({value: '900', from: accounts[1], gas: '100000000'});

        await apartment.methods.payForRent().send({from: accounts[1], gas: '100000000'});

        let balance2 = await web3.eth.getBalance(accounts[0]);

        assert.equal(parseInt(balance), (balance2-900));
    });

    it('cancel rent on the first day', async () => {
        let today = new Date()
        let tomorrow =  new Date()
        tomorrow.setDate(today.getDate() + 1)
        let dayAfterTomorrow =  new Date()
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        today = Date.parse(today)
        tomorrow = Date.parse(tomorrow)
        dayAfterTomorrow = Date.parse(dayAfterTomorrow)

        await apartment.methods.rent([today, tomorrow, dayAfterTomorrow])
            .send({value: '900', from: accounts[1], gas: '100000000'});

        const tenantBalanceBefore = await apartment.methods.tenantBalance(accounts[1]).call();

        await apartment.methods.cancelRent(today).send({from: accounts[1], gas: '100000000'});

        const tenantBalanceAfter = await apartment.methods.tenantBalance(accounts[1]).call();

        assert.equal(tenantBalanceBefore - 900, tenantBalanceAfter);
    })

    it('trying to cancel but is too late', async () => {
        let today = new Date()
        let tomorrow =  new Date()
        tomorrow.setDate(today.getDate() + 1)
        let dayAfterTomorrow =  new Date()
        dayAfterTomorrow.setDate(tomorrow.getDate() + 1)

        today = Date.parse(today)
        tomorrow = Date.parse(tomorrow)
        dayAfterTomorrow = Date.parse(dayAfterTomorrow)

        await apartment.methods.rent([today, tomorrow, dayAfterTomorrow])
            .send({value: '900', from: accounts[1], gas: '100000000'});

        let executed;
        try {
            await apartment.methods.cancelRent(tomorrow).send({from: accounts[1], gas: '100000000'});
            executed = 'success';
        } catch (e) {
            executed = 'fail';
        }

        assert.equal('fail', executed);
    })
});
