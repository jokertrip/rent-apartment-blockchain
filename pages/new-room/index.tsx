import {NextPage} from 'next'
import React from "react";
import {useForm} from "react-hook-form";
import classes from "./index.module.css";


const NewRoom: NextPage = () => {
    const {register, handleSubmit} = useForm();

    const onSubmit = (data: any) => {
        console.log(data)
    };

    return (
        <React.Fragment>
            <h2>Add an apartment</h2>
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Country:</label>
                    <input className={classes.formField} {...register("country")} />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>City:</label>
                    <input className={classes.formField} {...register("city")}  />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Description:</label>
                    <input className={classes.formFieldDesc} {...register("description")}  />
                </div>
                <div className={classes.formGroup}>
                    <label className={classes.formLabel}>Price for day:</label>
                    <input className={classes.formField} {...register("price for day")}  />
                </div>
                <button className={classes.formSubmitBtn} type="submit">Submit</button>
            </form>
        </React.Fragment>
    )
}

export default NewRoom
