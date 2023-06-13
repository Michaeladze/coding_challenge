import { create } from 'zustand';
import {Payment, Product, ProductsCheckout, ProductsResponse} from '../Types/Product';
import {ProductHttpService} from '../Http/Products.http.service';

export interface IProductState {
    products: Product[];
    productsLoaded: boolean;
    fetchProducts: () => void;

    totalCost: number;
    totalAmount: number;
    selectProduct: (product: Product, quantity: number) => void;
    selectedProducts: ProductsCheckout[];
}

export const useProductStore = create<IProductState>((set) => ({
    products: [],
    productsLoaded: false,
    fetchProducts: async () => {
        const response: ProductsResponse = await ProductHttpService.getProducts();
        return set(() => {
            return {
                products: response.products,
                productsLoaded: true
            };
        });
    },

    totalCost: 0,
    totalAmount: 0,
    selectedProducts: [],
    selectProduct: (product: Product, quantity: number) => {
        return set((state: IProductState) => {

            const selectedProducts = [...state.selectedProducts];

            const index = state.selectedProducts.findIndex((p: ProductsCheckout) => p.product.id === product.id);

            if (index >= 0) {
                if (quantity === 0) {
                    selectedProducts.splice(index, 1)
                } else {
                    selectedProducts[index] = {
                        product,
                        quantity
                    }
                }

            } else if (quantity !== 0) {
                selectedProducts.push({
                    product,
                    quantity
                })
            }


            const totalAmount = selectedProducts.reduce((sum: number, p: ProductsCheckout) => {
                return sum + p.quantity;
            }, 0);

            const totalCost = selectedProducts.reduce((sum: number, p: ProductsCheckout) => {
                return sum + p.quantity * p.product.price;
            }, 0);

            return {
                selectedProducts,
                totalAmount,
                totalCost: Number(totalCost.toFixed(2))
            };
        });
    }
}))
