import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Box, Button, Grid, InputAdornment, Typography} from '@mui/material';
import {IProductState, useProductStore} from '../../store/products';
import {TextFieldControl} from '../controls/TextFieldControl';
import {object, string} from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {PaymentInfo} from '../../Types/Product';

const schema = object({
    email: string().email().required('This field is required'),
    cardInfo: object({
        cardNo: string()
            .test({
                test: (value) => {
                    if (!value) {
                        return false;
                    }

                    const val = value.replace(/\s/g, '');
                    return val.length === 16 && !isNaN(+val);
                },
                message: 'Invalid value'
            })
            .required('This field is required'),
        cardExpiryDate: string().required('This field is required'),
        cardCVV: string()
            .test({
                test: (value) => {
                    if (!value) {
                        return false;
                    }

                    const val = value?.replace(/\s/g, '');
                    return val.length === 3 && !isNaN(+val);
                },
                message: 'Invalid value'
            })
            .required('This field is required'),
    })
});

interface IProps {
    onSubmit: (paymentInfo: PaymentInfo) => void;
}

export const CheckoutForm: React.FC<IProps> = ({ onSubmit }: IProps) => {
    const totalCost = useProductStore((state: IProductState) => state.totalCost);

    const form = useForm<PaymentInfo>({
        defaultValues: {
            email: '',
            cardInfo: {
                cardNo: '',
                cardExpiryDate: '',
                cardCVV: ''
            }
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolver: yupResolver(schema)
    });

    const {handleSubmit, setValue} = form;

    const onLocalSubmit = () => {
        handleSubmit(
            (paymentInfo: PaymentInfo) => {
                onSubmit(paymentInfo);
            },
            (errors) => {
                console.log(errors)
            })();
    }

    const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (key === 'cardInfo.cardNo') {
            const tmp = e.target.value.replace(/\D/g, '').split('');

            for (let i = tmp.length - 1; i >= 0; i--) {
                if (i % 4 === 0 && i !== 0) {
                    tmp.splice(i, 0, ' ');
                }
            }

            const value = tmp.join('');
            setValue(key, value);
        } else if (key === 'cardInfo.cardExpiryDate') {
            const tmp = e.target.value.replace(/\D/g, '').split('');

            if (tmp.length > 0) {
                tmp[0] = tmp[0].replace(/[4,5,6,7,8,9]/, '');
            }

            if (tmp.length > 1) {
                if (tmp[0] === '0') {
                    tmp[1] = tmp[1].replace(/[0]/, '');
                } else if (tmp[0] === '3') {
                    tmp[1] = tmp[1].replace(/[2,3,4,5,6,7,8,9]/, '');
                }
            }

            if (tmp.length > 2) {
                tmp.splice(2, 0, '/');
            }

            const value = tmp.join('');
            setValue(key, value);
        } else if (key === 'cardInfo.cardCVV') {
            setValue(key, e.target.value.replace(/\D/g, ''));
        }
    }

    return (
        <FormProvider {...form}>
            <Grid xs={12} item display='flex' flexDirection='column' gap={2} mt={4}>
                <Typography fontWeight={800}>Email</Typography>
                <TextFieldControl name='email' variant='outlined'/>


                <Typography fontWeight={800}>Card Information</Typography>
                <TextFieldControl name='cardInfo.cardNo'
                                  variant='outlined'
                                  onChange={onChange('cardInfo.cardNo')}
                                  inputProps={{
                                      maxLength: 19,
                                  }}
                                  InputProps={{
                                      endAdornment: (
                                          <InputAdornment position='end'>
                                              (
                                              <Box component='img' ml={1} src='mastercard.svg' sx={{width: '20px'}}/>
                                              <Box component='img' src='visa.svg' sx={{width: '20px'}}/>)
                                          </InputAdornment>
                                      ),
                                  }}/>

                <Grid container>
                    <Grid xs={6} item>
                        <TextFieldControl name='cardInfo.cardExpiryDate'
                                          variant='outlined'
                                          onChange={onChange('cardInfo.cardExpiryDate')}
                                          fullWidth
                                          inputProps={{
                                              maxLength: 5,
                                          }}/>

                    </Grid>
                    <Grid xs={6} item>
                        <TextFieldControl
                            name='cardInfo.cardCVV'
                            variant='outlined'
                            onChange={onChange('cardInfo.cardCVV')}
                            fullWidth
                            inputProps={{
                                maxLength: 3,
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Box component='img' src='cvc.png' sx={{width: '20px'}}/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid xs={12} item justifyContent='center' display='flex' mt={4}>
                    <Button variant='contained' color='secondary' onClick={onLocalSubmit}>
                        Pay {totalCost} TBH
                    </Button>
                </Grid>

            </Grid>
        </FormProvider>
    );
};
