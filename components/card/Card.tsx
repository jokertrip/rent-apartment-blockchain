import React from "react";
import { apartment } from "../../ethereum/web3utils";
import classes from "./Card.module.css";
import {NextPage} from "next";

type Props = {
    address: string
}

const Card: NextPage<Props> = ({address}) => {
    const [images, setImages] = React.useState([])
    const [country, setCountry] = React.useState('')
    const [city, setCity] = React.useState('')
    const [desc, setDesc] = React.useState('')
    const [priceForDay, setPriceForDay] = React.useState('')

    React.useEffect(()=>{
        const func = async () => {
            const apartmentL = apartment(address)
            const summary = await apartmentL.methods.getSummary().call();
            setImages(summary[0])
            setCountry(summary[1])
            setCity(summary[2])
            setDesc(summary[3])
            setPriceForDay(summary[4])
        }
        func()
    },[])

    return (
        <div className={classes.card}>
            <img className={classes.image} src={images[0]}/>
            <div className={classes.cardBody}>
                <p>Country: {country}</p>
                <p>City: <strong>{city}</strong></p>
                <p>Description: <strong>{desc}</strong></p>
                <p>Price: <strong>{priceForDay}</strong></p>
            </div>
        </div>
    )
}

export default Card
