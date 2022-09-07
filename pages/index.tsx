import type { NextPage } from 'next'
import React from "react";
import Card from '../components/card/Card'
import {factory} from "../ethereum/web3utils";

const Home: NextPage = () => {
    const [apartments, setApartments] = React.useState([])

    React.useEffect(()=>{
        try{
            const func = async () =>{
                let _factory = factory()
                if(_factory){
                    const deployedApartments = await _factory.methods.getDeployedApartments().call();
                    setApartments(deployedApartments)
                }
            }
            func()
        } catch(e){
            console.log(e)
        }
    }, [])

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        {apartments.length > 0 && apartments.map(address=> <Card address={address}/>)}
    </div>
  )
}

export default Home
