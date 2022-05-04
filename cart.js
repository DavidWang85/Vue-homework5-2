import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'david-frontend';

const app = createApp({
    data(){
        return{
            cartData:{},
            products: [],
            productId: '',
            isLoadingItem: '',
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res =>{
                    this.products = res.data.products;
                    console.log(this.products);
                })
        },
        openProductModal(id){
            this.productId = id;
            this.$refs.productModal.openModal();
        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    console.log(res);
                    this.cartData = res.data.data;
                })
        },
        addToCart(id, qty=1){
            const data = {
                product_id : id,
                qty,
            };
            this.isLoadingItem = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, {data})
                .then(res => {
                    console.log(res);
                    this.getCart();
                    this.$refs.productModal.closeModal();
                    this.isLoadingItem = '';
                })
        },
        removeCartItem(id){
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                .then(res => {
                    console.log('刪除', res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
        },
        removeAllCarts(){
            this.isLoadingItem = 'clear';
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    console.log('刪除全部', res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
        },
        updateCartItem(item) {
            const data = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    console.log('put購物車', res);
                    this.getCart();
                    this.isLoadingItem = '';
                })
        },
    },
    mounted(){
        this.getProducts();
        this.getCart();
    }
});

//全域註冊的內層
app.component('product-modal', {
    template:`#userProductModal`,
    props: ['id'],
    watch: {
        id(){
            this.getProduct();
        }
    },
    data(){
        return{
            modal:{},
            product: {},
            qty: 1,
        }
    },
    methods:{
        openModal(){
            this.modal.show();
        },
        getProduct(){
            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then(res => {
                    this.product = res.data.product;
                    console.log(res);
                })
        },
        addToCart() {
            this.$emit('add-cart', this.product.id, this.qty);
        },
        closeModal(){
            this.modal.hide();
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})
app.mount('#app');