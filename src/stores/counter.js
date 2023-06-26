import { ref } from 'vue'
import { defineStore } from 'pinia'



export const useInvoiceModal = defineStore('InvoiceModal',{
  state:() =>({
    invoice_Modal:ref(false),
    modal_active:ref(false),
    edit_active:ref(false),
    current_data_from_edit:ref(null),
    draft_data:null,
    update_data:null,
    publish_data:null,
  }),
  getters :{
    },
  actions : {
    toggle_invoice_modal(){
      this.invoice_Modal = !this.invoice_Modal
    },
      toggle_modal() {
        this.modal_active = !this.modal_active
      },
      toggle_edit() {
        this.edit_active = !this.edit_active
      },
      draft_data_f() {
        this.draft_data = true;
      },
      update_data_f() {
        this.update_data = true;
      },
      publish_data_f() {
        this.publish_data = true;
      },
  },
});