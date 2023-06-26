<template>
    <div class="home container">
        <!-- header  -->
        <div class="header flex">
            <div class="flex left flex-column">
                <h1>Invoices</h1>
                <span> there are {{ invoice_data.length }} total invoices</span>
            </div>
            <div class="flex right">
                <div @click="filter_toggle" class="filter flex" ref="filter">
                    <span>Filter By Status </span>
                    <img src="@/assets/images/icon-arrow-down.svg" alt="" />
                    <ul v-show="filter_menu" class="filter-menu">
                        <li @click="filter_invoice">Draft</li>
                        <li @click="filter_invoice">Pending</li>
                        <li @click="filter_invoice">Paid</li>
                        <li @click="filter_invoice">Clear Filter</li>
                    </ul>
                </div>
                <div @click="new_invoice" class="flex button">
                    <div class="inner-button flex">
                        <img src="@/assets/images/icon-plus.svg" alt="" />
                    </div>
                    <span>New Invoice</span>
                </div>
            </div>
        </div>
        <Loading v-show="data_loaded" />
        <div class="" v-if="invoice_data.length > 0">
            <Invoice v-for="(invoice, index ) in invoice_data" :invoice="invoice" :key="index" />
        </div>
        <div class="empty flex flex-column" v-else>
            <img src="@/assets/images/illustration-empty.svg" alt="">
            <h3>There is nothing here</h3>
            <p>Create a new invoice by clicking the New Invoice button and get started</p>
        </div>
    </div>
</template>

<script>
import Loading from '../components/Loading.vue';
import Invoice from '../components/Invoice.vue';
import { ref } from 'vue';
import { useInvoiceModal } from '../stores/counter';
import { supabase } from '../supabase/supabase';
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Home",
    components: {
        Invoice,
        Loading,
    },
    setup() {
        const filter = ref(null);
        // get data from supabase 
        const data_loaded = ref(true);
        const invoice_data = ref([]);
        const get_data = async () => {
            const { data: invoices } = await supabase.from('invoices').select('*');
            invoice_data.value = invoices;
            data_loaded.value = false;
        }
        get_data();
        if(invoice_data.publish_data || invoice_data.edit_data || invoice_data.publish_data){
        get_data();
        }

        const filter_menu = ref(null);
        const filter_toggle = () => {
            filter_menu.value = !filter_menu.value;
        }
        // function filter_invoice(e){
        //     if (e.target.innerText === "Clear Filter") {
        //     console.log(e)
        //         filter.value = null;
        //         return
        //     }
        //     filter.value = e.target.innerText;
        //     filteredData();
        // }
        // filter_invoice()
        // const filteredData = () => {
        //     return this.invoice_data.filter((invoice) => {
        //         if (filter.value === "Draft") {
        //             return invoice.invoiceDraft === true;
        //         }
        //         if (filter.value === "Pending") {
        //             return invoice.invoicePending === true;
        //         }
        //         if (filter.value === "Paid") {
        //             return invoice.invoicePaid === true;
        //         }
        //         return invoice;
        //     });
        // }

        const Invoice_model = useInvoiceModal();
        const new_invoice = () => {
            Invoice_model.toggle_invoice_modal();
        }
        return { filter, data_loaded, invoice_data, filter_menu, filter_toggle, new_invoice }
    }
}
</script>

<style lang="scss" scoped>
.home {
    color: #fff;

    .header {
        margin-bottom: 65px;

        .left,
        .right {
            flex: 1;
        }

        .right {
            justify-content: flex-end;
            align-items: center;

            .button,
            .filter {
                align-items: center;

                span {
                    font-size: 12px;
                }
            }

            .filter {
                position: relative;
                margin-right: 40px;
                cursor: pointer;

                img {
                    margin-left: 12px;
                    width: 9px;
                    height: 5px;
                }

                .filter-menu {
                    width: 120px;
                    position: absolute;
                    top: 25px;
                    list-style: none;
                    background-color: #1e2139;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

                    li {
                        cursor: pointer;
                        font-size: 12px;
                        padding: 10px 20px;

                        &:hover {
                            color: #1e2139;
                            background-color: #fff;
                        }
                    }
                }
            }

            .button {
                padding: 8px 10px;
                background-color: #7c5dfa;
                border-radius: 40px;

                .inner-button {
                    margin-right: 8px;
                    border-radius: 50%;
                    padding: 8px;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;

                    img {
                        width: 10px;
                        height: 10px;
                    }
                }
            }
        }
    }

    .empty {
        margin-top: 160px;
        align-items: center;

        img {
            width: 214px;
            height: 200px;
        }

        h3 {
            font-size: 20px;
            margin-top: 40px;
        }

        p {
            text-align: center;
            max-width: 224px;
            font-size: 12px;
            font-weight: 300;
            margin-top: 16px;
        }
    }
}
</style>