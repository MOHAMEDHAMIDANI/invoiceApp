<template>
    <div class="modal flex">
        <div class="modal-content">
            <p>Are you sure you want to exit? Your changes will not be saved?</p>
            <div class="actions flex">
                <button @click="close_modal" class="purple">Return</button>
                <button @click="close_invoice" class="red">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useInvoiceModal } from '../stores/counter';
export default {
    setup() {
        const Invoice_model = useInvoiceModal();
        const edit_state = useInvoiceModal().edit_active;
        const close_modal = () => {      
            Invoice_model.toggle_modal(); 
        }
        const close_invoice = () => {
            Invoice_model.toggle_invoice_modal();
            if(edit_state){
            Invoice_model.toggle_edit();
            }
            Invoice_model.toggle_modal();
            
        }
        return {close_invoice,close_modal}
    }
}
</script>

<style lang="scss" scoped>
.modal {
    z-index: 100;
    position: fixed;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;

    .modal-content {
        border-radius: 20px;
        padding: 48px 32px;
        max-width: 450px;
        background-color: #252945;
        color: #fff;

        p {
            text-align: center;
        }

        .actions {
            margin-top: 24px;

            button {
                flex: 1;
            }
        }
    }
}</style>