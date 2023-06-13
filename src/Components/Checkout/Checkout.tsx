import {
  Alert,
  Box,
  Button,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import theme from '../../theme'
import {IProductState, useProductStore} from '../../store/products';
import {Payment, PaymentInfo, PaymentProduct, ProductsCheckout} from '../../Types/Product';
import CheckoutItem from './CheckoutItem';
import {CheckoutForm} from './CheckoutForm';
import {ProductHttpService} from '../../Http/Products.http.service';
import {useNavigate} from 'react-router-dom';

export default function Checkout() {
    const navigate = useNavigate();
    const selectedProducts = useProductStore((state: IProductState) => state.selectedProducts);

  const [displayResponse, setDisplayResponse] = useState<boolean>(false)

  const onSubmit = async (paymentInfo: PaymentInfo) => {

      const checkout: Payment = {
          requestId: '1',
          paymentInfo,
          products: selectedProducts.map((p: ProductsCheckout) => {
              return {
                  id: p.product.id,
                  quantity: p.quantity
              }
          })
      }
      try {
          await ProductHttpService.buyProducts(checkout);
          navigate('/thanks')
      } catch (e) {
          setDisplayResponse(true);
      }

  }

  const selectedProductsJSX = selectedProducts.map((product: ProductsCheckout) => {
      return <CheckoutItem key={product.product.id} holder={product}/>
  })

  return (
    <Grid container display='flex' justifyContent='center'>
      <Grid
        display='flex'
        flexDirection='column'
        gap={2}
        maxWidth={'700px'}
        m={6}
        sx={{
          [theme.breakpoints.down('sm')]: {
            maxWidth: 'unset',
          },
        }}
      >
        <Grid xs={12} item mb={5}>
          <Typography align='center' variant='h4' fontWeight={800}>
            Checkout
          </Typography>

            <Grid xs={12} item display='flex' flexDirection='column' gap={4} mt={4}>
            { selectedProductsJSX }
            </Grid>
        </Grid>

          <CheckoutForm onSubmit={onSubmit} />
      </Grid>

      <Snackbar
        open={displayResponse}
        autoHideDuration={6000}
        onClose={() => setDisplayResponse(false)}
      >
        <Alert severity='error'>Something went wrong. Please try again.</Alert>
      </Snackbar>
    </Grid>
  )
}
