import {NextPage} from 'next'
import Router from 'next/router';
import React from "react";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import { create } from 'ipfs-http-client'
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./index.module.css";
import selectOptions from '../../data.json'
import {factory, web3} from '../../ethereum/web3utils';

interface FormInputs {
    image: FileList;
    country: {
        value: string
        label: string
    };
    city: string;
    description: string;
    priceForDay: number;
}

// @ts-ignore
const client = create('https://ipfs.infura.io:5001/api/v0')

const NewRoom: NextPage = () => {
    const [fileUrlArr, updateFileUrlArr] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        setLoading(true)
        try {
            let _web3 = web3()
            let _factory = factory()
            const accounts = await _web3!.eth.getAccounts();
            await _factory.methods
                .createApartment(fileUrlArr, data.country.label, data.city, data.description, data.priceForDay)
                .send({
                    from: accounts[0],
                });
            await Router.push('/')
        } catch (err: any) {
            alert(err.message)
            console.log('error', err)
        }
        setLoading(false)
    };

    const uploadFile = async (e: any) => {
        const file = e.target.files[0]
        try {
            const added = await client.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            updateFileUrlArr(prevState => [...prevState, url])
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const deleteFile = (url: string) => {
        updateFileUrlArr(fileUrlArr.filter(el => el !== url))
    }

    return (
        <React.Fragment>
            <h2>Add an apartment</h2>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Apartment images:</label>
                    <input className={classes.formFieldFiles} type="file" {...register("image", { required: "Image is required." })} onChange={uploadFile}/>
                    <div className={classes.display}>
                    {
                        fileUrlArr && fileUrlArr.map(url =>
                            <div className={classes.imageContainer}>
                                <img className={classes.image} src={url} />
                                <div onClick={() => deleteFile(url)}>
                                    <AiOutlineCloseCircle className={classes.icon} />
                                </div>
                            </div>
                        )
                    }
                    </div>
                    {errors.image && <div className={classes.error}>{errors.image.message}</div>}
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Country:</label>
                    <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        rules= {{required: "Country is required."}}
                        render={({ field }) => (
                            <Select options={selectOptions} {...field} instanceId="long-value-select"/>
                        )}
                    />
                    {errors.country && <div className={classes.error}>{errors.country.message}</div>}
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>City:</label>
                    <input className={classes.formField} {...register("city", { required: "City is required." })}  />
                    {errors.city && <div className={classes.error}>{errors.city.message}</div>}
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Description:</label>
                    <textarea className={classes.formFieldDesc} {...register("description", { required: true, minLength: 50 })}  />
                    {errors.description?.type === 'required' && <div className={classes.error}>{'Description is required'}</div>}
                    {errors.description?.type === 'minLength' && <div className={classes.error}>{"Minimum length is 50 letters"}</div>}
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Price for day:</label>
                    <input className={classes.formField} type="number" {...register("priceForDay", { required: "Price is required." })}  />
                    {errors.priceForDay && <div className={classes.error}>{errors.priceForDay.message}</div>}
                </div>
                <button className={classes.formSubmitBtn} type="submit" disabled={loading}>{loading? <span>loading</span> : <span>Submit</span>}</button>
            </form>
        </React.Fragment>
    )
}

export default NewRoom
