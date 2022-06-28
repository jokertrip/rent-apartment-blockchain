import {NextPage} from 'next'
import React from "react";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import { create } from 'ipfs-http-client'
import classes from "./index.module.css";
import selectOptions from '../../data.json'

interface FormInputs {
    image: FileList;
    country: string;
    city: string;
    description: string;
    priceForDay: number;
}

// @ts-ignore
const client = create('https://ipfs.infura.io:5001/api/v0')

const NewRoom: NextPage = () => {
    const [fileUrlArr, updateFileUrlArr] = React.useState<string[]>([])
    const {register, handleSubmit, control, formState: { errors }} = useForm<FormInputs>();

    const registerOptions = {
        country: { required: "Country is required" }
    };

    const onSubmit = (data: FormInputs) => {
        console.log(data)
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
                            <img className={classes.image} src={url} />
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
                    <input className={classes.formField} type="number" {...register("priceForDay")}  />
                </div>
                <button className={classes.formSubmitBtn} type="submit">Submit</button>
            </form>
        </React.Fragment>
    )
}

export default NewRoom
