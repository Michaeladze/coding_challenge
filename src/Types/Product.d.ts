export interface Product {
  id: number
  name: string
  price: number
  currency: string
}

export interface ProductsResponse {
  requestId: string
  products: Product[]
}

export interface ProductsCheckout {
  quantity: number
  product: Product
}

export interface Payment {
  requestId: string
  paymentInfo: {
    email: string
    cardInfo: {
      cardNo: string
      cardExpiryDate: string
      cardCVV: string
    }
  }
  products: PaymentProduct[]
}

export interface PaymentInfo {
  email: string
  cardInfo: CardInfo;
}

export interface CardInfo {
  cardNo: string
  cardExpiryDate: string
  cardCVV: string
}

export interface PaymentProduct {
  id: number
  quantity: number
}
