<template>
    <div class="invoice-wrap flex flex-column">
        <Transition name="invoice">
            <Modal v-if="Invoice_model.modal_active" />
        </Transition>
        <form @submit.prevent="submit_form" class="invoice-content" ref="invoiceWrap">
            <Loading v-show="loading" />
            <h1 v-if="!edit_state">New Invoice </h1>
            <h1 v-else>Edit Invoice </h1>
            <!-- Bill from  -->
            <div class="bill-from flex flex-column">
                <h4> Bill From</h4>
                <div class="input flex flex-column">
                    <label for="billerStreetAddress">Street Address</label>
                    <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="billerCity">City</label>
                        <input required type="text" id="billerCity" v-model="billerCity">
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerZipCode">Zip Code </label>
                        <input required type="text" id="billerZipCode" v-model="billerZipCode">
                    </div>
                    <div class="input flex flex-column">
                        <label for="billerCountry">County</label>
                        <input required type="text" id="billerCountry" v-model="billerCountry">
                    </div>
                </div>
            </div>

            <!-- Bill to  -->
            <div class="bill-to flex flex-column">
                <h4> Bill To</h4>
                <div class="input flex flex-column">
                    <label for="clientName">Client's Name</label>
                    <input required type="text" id="clientName" v-model="clientName">
                </div>
                <div class="input flex flex-column">
                    <label for="clientEmail">Client's Email</label>
                    <input required type="text" id="clientEmail" v-model="clientEmail">
                </div>
                <div class="input flex flex-column">
                    <label for="clientStreetAddress">Client's Street Address</label>
                    <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
                </div>
                <div class="location-details flex">
                    <div class="input flex flex-column">
                        <label for="clientCity">City</label>
                        <input required type="text" id="clientCity" v-model="clientCity">
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientZipCode">Zip Code </label>
                        <input required type="text" id="clientZipCode" v-model="clientZipCode">
                    </div>
                    <div class="input flex flex-column">
                        <label for="clientCountry">County</label>
                        <input required type="text" id="clientCountry" v-model="clientCountry">
                    </div>
                </div>
            </div>

            <!-- Invoice Work  -->
            <div class="invoice-work flex flex-column">
                <div class="payment flex">
                    <div class="input flex flex-column">
                        <label for="invoiceDate">Invoice Date</label>
                        <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
                    </div>
                    <div class="input flex flex-column">
                        <label for="paymentDueDate">Payment Due</label>
                        <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate">
                    </div>
                </div>
                <div class="input flex flex-column">
                    <label for="paymentTerms">Payment Terms</label>
                    <select required id="paymentTerms" v-model="paymentTerms">
                        <option value="30">Net 30 Days</option>
                        <option value="60">Net 60 Days</option>
                        <option value="90">Net 90 Days</option>
                    </select>
                </div>
                <div class="input flex flex-column">
                    <label for="productDescription">Product Description</label>
                    <input required type="text" id="productDescription" v-model="productDescription">
                </div>
                <div class="work-items">
                    <h3>Item List </h3>
                    <table class="item-list">
                        <tr class="flex table-heading">
                            <th class="item-name">Item Name</th>
                            <th class="qty">Qty</th>
                            <th class="price">Price</th>
                            <th class="total">Total</th>
                        </tr>
                        <tr class="flex table-items" v-for="(item, index) in invoiceItemList" :key="index">
                            <td class="item-name"> <input type="text" v-model="item.name"></td>
                            <td class="qty"><input type="text" v-model="item.qty"></td>
                            <td class="price"><input type="text" v-model="item.price"></td>
                            <td class="total flex"> ${{ item.total =item.qty * item.price }}</td>
                            <img @click="delete_invoice_item(item.id)" src="../assets/images/icon-delete.svg" alt="">
                        </tr>
                    </table>
                    <div @click="add_new_invoice_item" class="flex button">
                        <img src="../assets/images/icon-plus.svg" alt="">
                        Add New
                    </div>
                </div>
            </div>

            <!-- save /exit  -->
            <div class="flex save">
                <div class="left">
                    <button type="button" @click="close_invoice" class="red">Cancel</button>
                </div>
                <div class="right flex ">
                    <button v-if="!edit_state" type="submit" @click="save_draft" class="dark-purple">Save Draft</button>
                    <button v-if="!edit_state" type="submit" @click="publish_invoice" class="purple">Create Invoice
                    </button>
                    <button v-if="edit_state" type="submit" @click="update_invoice" class="purple"> Update Invoice
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Modal from './Modal.vue'
import Loading from './Loading.vue';
import { supabase } from '../supabase/supabase'
import { uid } from 'uid';
import { ref, watch } from 'vue';
import { useInvoiceModal } from '../stores/counter';
import { onClickOutside } from '@vueuse/core'
export default {
    name: 'invoiceModel',
    components: {
        Loading, Modal
    },
    setup() {
        const dateOptions = ref({ year: "numeric", month: "short", day: "numeric" });
        const loading = ref(false);
        let billerStreetAddress = ref(null);
        let billerCity = ref(null);
        let billerZipCode = ref(null);
        let billerCountry = ref(null);
        let clientName = ref(null);
        let clientEmail = ref(null);
        let clientStreetAddress = ref(null);
        let clientCity = ref(null);
        let clientZipCode = ref(null);
        let clientCountry = ref(null);
        let invoiceDateUnix = ref(null);
        let invoiceDate = ref(null);
        let paymentTerms = ref(null);
        let paymentDueDateUnix = ref(null);
        let paymentDueDate = ref(null);
        let productDescription = ref(null);
        let invoicePending = ref(null);
        let invoiceDraft = ref(null);
        let invoiceItemList = ref([]);
        let invoiceTotal = ref(0);
        let invoicePaid = ref(null);
        // toggle invoice 
        const Invoice_model = useInvoiceModal();
        const edit_state = useInvoiceModal().edit_active;
        const close_invoice = () => {
            if (edit_state) {
                Invoice_model.toggle_edit();
            }
            Invoice_model.toggle_invoice_modal();
        }
        // get date to invoice
        if (!edit_state) {
            invoiceDateUnix.value = Date.now();
            invoiceDate.value = new Date(invoiceDateUnix.value).toLocaleDateString("en-us", dateOptions);
        }

        // calculate payment due 
        watch(paymentTerms, () => {
            const future_date = new Date();
            paymentDueDateUnix.value = future_date.setDate(future_date.getDate() + parseInt(paymentTerms.value));
            paymentDueDate.value = new Date(paymentDueDateUnix.value).toLocaleDateString("en-us", dateOptions);
        });
        // add new invoice item to the table 
        const add_new_invoice_item = () => {
            invoiceItemList.value.push({
                id: uid(),
                name: "",
                qty: "",
                price: 0,
                total: 0,

            })
        }
        // deleting  invoice item from the table
        const delete_invoice_item = (id) => {
            invoiceItemList.value = invoiceItemList.value.filter((item) => {
                item.id !== id;
            })
        }
        // calculating invoice total 
        const cal_inv_total = () => {
            invoiceTotal.value = 0;
            invoiceItemList.value.forEach((item) => {
                invoiceTotal.value += item.total;
            })
        }
        cal_inv_total();
        // save_draft function 
        const save_draft = () => {
            invoiceDraft.value = true;
        }
        // publish_invoice function 
        const publish_invoice = () => {
            invoicePending.value = true;
        }
        //upload invoice to supabase 
        const upload_invoice = async () => {
            if (invoiceItemList.value.length <= 0) {
                alert("Please ensure you filled work items!");
                return;
            }
            loading.value = true;
            cal_inv_total();
            await supabase.from('invoices').insert([{
                billerStreetAddress: billerStreetAddress.value,
                billerCity: billerCity.value,
                billerZipCode: billerZipCode.value,
                billerCountry: billerCountry.value,
                clientName: clientName.value,
                clientEmail: clientEmail.value,
                clientStreetAddress: clientStreetAddress.value,
                clientCity: clientCity.value,
                clientZipCode: clientZipCode.value,
                clientCountry: clientCountry.value,
                invoiceDateUnix: invoiceDateUnix.value,
                invoiceDate: invoiceDate.value,
                paymentTerms: paymentTerms.value,
                paymentDueDateUnix: paymentDueDateUnix.value,
                paymentDueDate: paymentDueDate.value,
                productDescription: productDescription.value,
                invoicePending: invoicePending.value,
                invoiceDraft: invoiceDraft.value,
                invoiceItemList: invoiceItemList.value,
                invoiceTotal: invoiceTotal.value,
                invoicePaid: invoicePaid.value,
            }]);
            loading.value = false;
            billerStreetAddress.value = null;
            billerCity.value = null;
            billerZipCode.value = null;
            billerCountry.value = null;
            clientName.value = null;
            clientEmail.value = null;
            clientStreetAddress.value = null;
            clientCity.value = null;
            clientZipCode.value = null;
            clientCountry.value = null;
            invoiceDateUnix.value = null;
            invoiceDate.value = null;
            paymentTerms.value = null;
            paymentDueDateUnix.value = null;
            paymentDueDate.value = null;
            productDescription.value = null;
            invoicePending.value = null;
            invoiceDraft.value = null;
            invoiceItemList.value = [];
            invoiceTotal.value = 0;
            invoicePaid.value =null;
            close_invoice();
        }
        const submit_form = () => {
            upload_invoice();
        }
        const invoiceWrap = ref(null);
        onClickOutside(invoiceWrap, () => {
            if (Invoice_model.invoice_Modal && !Invoice_model.modal_active) {
                Invoice_model.toggle_modal();
            }
        })
        // edit invoice 
        if (edit_state) {
            loading.value = true;
            let current_data = ref(null);
            const edit_data = async () => {
                const { data: Invoices } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('id', Invoice_model.current_data_from_edit);
                current_data.value = Invoices[0];
                billerStreetAddress.value = current_data.billerStreetAddress;
                billerCity.value = current_data.billerCity;
                billerZipCode.value = current_data.billerZipCode;
                billerCountry.value = current_data.billerCountry;
                clientName.value = current_data.clientName;
                clientEmail.value = current_data.clientEmail;
                clientStreetAddress.value = current_data.clientStreetAddress;
                clientCity.value = current_data.clientCity;
                clientZipCode.value = current_data.clientZipCode;
                clientCountry.value = current_data.clientCountry;
                invoiceDateUnix.value = current_data.invoiceDateUnix;
                invoiceDate.value = current_data.invoiceDate;
                paymentTerms.value = current_data.paymentTerms;
                paymentDueDateUnix.value = current_data.paymentDueDateUnix;
                paymentDueDate.value = current_data.paymentDueDate;
                productDescription.value = current_data.productDescription;
                invoicePending.value = current_data.invoicePending;
                invoiceDraft.value = current_data.invoiceDraft;
                invoiceItemList.value = current_data.invoiceItemList;
                invoiceTotal.value = current_data.invoiceTotal;
                invoicePaid.value = current_data.invoicePaid;
                loading.value = false;
            }
            edit_data()
        }

        const update_invoice = () => {
            Invoice_model.update_data_f();
        }
        if (Invoice_model.update_data && edit_state) {
            loading.value = true;
            const update_data = async () => {
                await supabase.from('invoices').update(
                    {
                        billerStreetAddress: billerStreetAddress.value,
                        billerCity: billerCity.value,
                        billerZipCode: billerZipCode.value,
                        billerCountry: billerCountry.value,
                        clientName: clientName.value,
                        clientEmail: clientEmail.value,
                        clientStreetAddress: clientStreetAddress.value,
                        clientCity: clientCity.value,
                        clientZipCode: clientZipCode.value,
                        clientCountry: clientCountry.value,
                        invoiceDateUnix: invoiceDateUnix.value,
                        invoiceDate: invoiceDate.value,
                        paymentTerms: paymentTerms.value,
                        paymentDueDateUnix: paymentDueDateUnix.value,
                        paymentDueDate: paymentDueDate.value,
                        productDescription: productDescription.value,
                        invoicePending: invoicePending.value,
                        invoiceDraft: invoiceDraft.value,
                        invoiceItemList: invoiceItemList.value,
                        invoiceTotal: invoiceTotal.value,
                        invoicePaid: invoicePaid.value,
                    }
                ).eq('id', Invoice_model.current_data_from_edit)
            }
            loading.value = false;
        }




        return { update_invoice, edit_state, submit_form, Invoice_model, invoiceWrap, publish_invoice, save_draft, delete_invoice_item, add_new_invoice_item, close_invoice, dateOptions, loading, billerStreetAddress, billerCity, billerZipCode, billerCountry, clientName, clientEmail, clientStreetAddress, clientCity, clientZipCode, clientCountry, invoiceDateUnix, invoiceDate, paymentTerms, paymentDueDateUnix, paymentDueDate, productDescription, invoicePending, invoiceDraft, invoiceItemList, invoiceTotal }
    }
}
</script>

<style lang="scss" scoped>
.invoice-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: scroll;

    &::-webkit-scrollbar {
        display: none;
    }

    @media (min-width: 900px) {
        left: 90px;
    }

    .invoice-enter-active,
    .invoice-leave-active {
        transition: opacity 1s ease;
    }

    .invoice-enter-from,
    .invoice-leave-to {
        opacity: 0;

    }

    .invoice-content {
        position: relative;
        padding: 56px;
        max-width: 700px;
        width: 100%;
        background-color: #141625;
        color: #fff;
        box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        h1 {
            margin-bottom: 48px;
            color: #fff;
        }

        h3 {
            margin-bottom: 16px;
            font-size: 18px;
            color: #777f98;
        }

        h4 {
            color: #7c5dfa;
            font-size: 12px;
            margin-bottom: 24px;
        }

        // Bill To / Bill From
        .bill-to,
        .bill-from {
            margin-bottom: 48px;

            .location-details {
                gap: 16px;

                div {
                    flex: 1;
                }
            }
        }

        // Invoice Work

        .invoice-work {
            .payment {
                gap: 24px;

                div {
                    flex: 1;
                }
            }

            .work-items {
                .item-list {
                    width: 100%;

                    // Item Table Styling
                    .table-heading,
                    .table-items {
                        gap: 16px;
                        font-size: 12px;

                        .item-name {
                            flex-basis: 50%;
                        }

                        .qty {
                            flex-basis: 10%;
                        }

                        .price {
                            flex-basis: 20%;
                        }

                        .total {
                            flex-basis: 20%;
                            align-self: center;
                        }
                    }

                    .table-heading {
                        margin-bottom: 16px;

                        th {
                            text-align: left;
                        }
                    }

                    .table-items {
                        position: relative;
                        margin-bottom: 24px;

                        img {
                            cursor: pointer;
                            position: absolute;
                            top: 15px;
                            right: 0;
                            width: 12px;
                            height: 16px;
                        }
                    }
                }

                .button {
                    color: #fff;
                    background-color: #252945;
                    align-items: center;
                    justify-content: center;
                    width: 100%;

                    img {
                        margin-right: 4px;
                    }
                }
            }
        }

        .save {
            margin-top: 60px;

            div {
                flex: 1;
            }

            .right {
                justify-content: flex-end;
            }
        }
    }

    .input {
        margin-bottom: 24px;
    }

    label {
        font-size: 12px;
        margin-bottom: 6px;
    }

    input,
    select {
        width: 100%;
        background-color: #1e2139;
        color: #fff;
        border-radius: 4px;
        padding: 12px 4px;
        border: none;

        &:focus {
            outline: none;
        }
    }
}
</style>