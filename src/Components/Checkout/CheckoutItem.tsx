import {Grid, Typography} from '@mui/material'
import {ProductsCheckout} from '../../Types/Product'

interface ProductProps {
    holder: ProductsCheckout
}

export default function CheckoutItem(props: ProductProps) {
    return (
        <Grid container direction='row'>
            <Grid container direction='column' item xs={6}>
                <Typography variant='body2' fontWeight={700}>
                    {props.holder.product.name}
                </Typography>
                <Typography variant='body2' fontWeight={500}>
                    {props.holder.product.price} {props.holder.product.currency}
                </Typography>
            </Grid>

            <Grid container direction='column' item xs={6}>
                <Typography variant='body2' fontWeight={700}>
                    {(props.holder.product.price * props.holder.quantity).toFixed(2)} {props.holder.product.currency}
                </Typography>
                <Typography variant='body2' fontWeight={400}>
                    Qty: {props.holder.quantity}
                </Typography>
            </Grid>
        </Grid>
    )
}
