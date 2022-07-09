import Web3 from 'web3'
import ApartmentFactory from './build/ApartmentFactory.json';
import Apartment from './build/Apartment.json';

export const web3 = () => {
    if (!window?.ethereum) return alert('Please install Metamask')
    window.ethereum.request({ method: "eth_requestAccounts" });
    return new Web3(window.ethereum);
}

export const factory = () => {
    try{
        let web3L = web3()
        return new web3L.eth.Contract(ApartmentFactory.abi, '0xFAECC62815a9e3404359ad76e3E5c68D6a463a91')
    } catch(e){
        console.log(e)
    }
}

export const apartment = (address) => {
    try{
        let web3L = web3()
        console.log('address', address)
        return new web3L.eth.Contract(Apartment.abi, address)
    }
    catch(e){
        console.log(e)
    }
}
