import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js";
import pagination from "./component/pagination.js";
import productmodal from "./component/productModal.js";
import delproductmodal from "./component/delProductModal.js";

const site = 'https://vue3-course-api.hexschool.io/v2'; 
const api_path = 'david-frontend';

let productModal = {};
let delProductModal = {};
const app = createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,
            pagination: {},
        }
    },
    components: {
        pagination,
        productmodal,
        delproductmodal,
    },
    methods: {
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)davidToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //以後每次請求時都把token加進去
            axios.defaults.headers.common['Authorization'] = token;
            const url = `${site}/api/user/check`;
            axios.post(url)
                .then(res => {
                    console.log(res);
                    this.getProducts();
                })
                .catch(() =>{
                    window.location = './login.html';
                })
        },
        getProducts(page = 1){
            const url = `${site}/api/${api_path}/admin/products/?page=${page}`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                })
        },
        openModal(status, product){
            if(status === 'isNew'){
                this.tempProduct = {
                    imagesUrl: [],
                };
                productModal.show();
                this.isNew = true;
            }else if(status === 'edit'){
                this.tempProduct = {...product};
                this.isNew = false;
                if(this.tempProduct.imagesUrl){
                    productModal.show(); //打開modal
                }
                else{
                    this.tempProduct.imagesUrl=[];
                    productModal.show(); //打開modal
                }
            }else if(status === 'delete'){
                this.tempProduct = {...product};
                if(this.tempProduct.imagesUrl){
                    delProductModal.show(); //打開modal
                }
                else{
                    this.tempProduct.imagesUrl=[];
                    delProductModal.show(); //打開modal
                }
            }
        },
        delProduct(){
            const url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url)
                .then(() => {
                    this.getProducts();
                    delProductModal.hide();
                })
        },
        hideModal(){
            productModal.hide(); 
        }
    },
    mounted() {
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
            });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
            });
    }
});
app.mount("#app")