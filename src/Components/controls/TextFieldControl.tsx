import React, {useEffect, useState} from 'react';
import {Grid, TextField, Typography} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
import {TextFieldProps} from '@mui/material/TextField/TextField';

type IProps =  TextFieldProps & {
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const TextFieldControl: React.FC<IProps> = (props: IProps) => {

    const { control, formState, getFieldState } = useFormContext();

    const { error } = getFieldState(props.name, formState)

    return (
        <Grid container direction='column'>
            <Controller
                name={props.name}
                control={control}
                render={({field: {onChange: localChange, value}}) => (
                    <TextField
                        {...props}
                        onChange={props.onChange || localChange}
                        value={value}
                    />
                )}
            />

            { error && (
                <Typography variant='body2' fontWeight={400}>
                    { error.message }
                </Typography>
            )}
        </Grid>

    );
};
