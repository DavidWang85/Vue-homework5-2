const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'david-frontend';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n; 


defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
    generateMessage: localize('zh_TW'), //啟用 locale
});

const app = Vue.createApp({
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    data(){
        return{
            isLoading: false,
            fullPage: true,
            cartData:{
                carts:[],
            },
            products: [],
            productId: '',
            isLoadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods:{
        getProducts(){
            this.isLoading = true;
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res =>{
                    this.products = res.data.products;
                    console.log(this.products);
                    this.isLoading = false;
                })
        },
        openProductModal(id){
            this.productId = id;
            setTimeout(() => {
                this.$refs.productModal.openModal();
            }, 300);
            
        },
        getCart() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    console.log(res);
                    this.cartData = res.data.data;
                })
        },
        addToCart(id, name, qty=1){
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
                    this.alertAddToCart(name);
                    this.isLoadingItem = '';
                })
        },
        removeCartItem(id, name){
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                .then(res => {
                    console.log('刪除', res);
                    this.getCart();
                    this.alertRemoveCartItem(name);
                    this.isLoadingItem = '';
                })
        },
        removeAllCarts(){
            this.isLoadingItem = 'clear';
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    console.log('刪除全部', res);
                    this.getCart();
                    this.alertRemoveAllCart();
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
                .then(() => {
                    console.log('put購物車', item);
                    this.getCart();
                    this.alertUpdateCartItem();
                    this.isLoadingItem = '';
                })
        },
        createOrder() {
            const order = this.form;
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data: order })
                .then(() => {
                    this.alertCreateOrder();
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        alertAddToCart(name) {
            //加入購物車顯示
            Swal.fire({
                toast: true,  //啟用吐司框
                title: `商品 ${name} <br>已成功加入購物車`,
                position: 'top-end', //位置
                timer: 2000,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "success"
            });
        },
        alertRemoveAllCart() {
            Swal.fire({
                toast: true,  //啟用吐司框
                title: "購物車已清空",
                position: 'top-end', //位置
                timer: 2000,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "info"
            });
        },
        alertRemoveCartItem(name) {
            Swal.fire({
                toast: true,  //啟用吐司框
                title: `商品 ${name} 以刪除`,
                position: 'top-end', //位置
                timer: 1500,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "info"
            });
        },
        alertCreateOrder() {
            Swal.fire({
                title: "訂單建立完成",
                text: "期待與你/妳的相遇",
                showConfirmButton: true,
                // color: "#663224",
                icon: "success",
                confirmButtonColor: "#008000",
            });
        },
        alertUpdateCartItem() {
            Swal.fire({
                toast: true,  //啟用吐司框
                title: `商品數量已更新`,
                position: 'top-end', //位置
                timer: 2000,   //倒數計時
                showConfirmButton: false,
                // color: "#663224",
                icon: "success"
            });
        },
        // addLoading() {
        //     // #2. 作為元件呼叫
        //     this.isLoading = true
        // }
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
            this.$emit('add-cart', this.product.id, this.product.title, this.qty);
        },
        closeModal(){
            this.qty = 1;
            this.modal.hide();
        }
    },
    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
})
app.component('loading', VueLoading.Component);
app.mount('#app');