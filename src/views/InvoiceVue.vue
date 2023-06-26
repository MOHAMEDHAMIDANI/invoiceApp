<template>
  <div class="invoice-view container">
    <router-link class="nav-link flex" :to="{ name: 'home' }">
      <img src="../assets/images/icon-arrow-left.svg" alt="" />Go Back
    </router-link>
    <div class="header flex">
      <Loading v-if="current_data_loaded" />
      <div class="left flex">
        <span>Status</span>
        <div class="status-button flex" :class="{
          paid: current_data.invoicePaid,
            draft: current_data.invoiceDraft,
              pending: current_data.invoicePending,
                          }">
          <span v-if="current_data.invoicePaid">Paid</span>
          <span v-if="current_data.invoiceDraft">Draft</span>
          <span v-if="current_data.invoicePending">Pending</span>
        </div>
      </div>
      <div class="flex right">
        <button @click="toggle_edit" class="dark-purple">Edit</button>
        <button @click="delete_invoice(current_data.id)" class="red">Delete</button>
        <button v-if="current_data.invoicePending" @click="mark_as_paid(current_data.id)"
          class="green">Mark as paid</button>
        <button v-if="current_data.invoiceDraft || current_data.invoicePaid" @click="mark_as_pending(current_data.id)" class="orange">
          Mark as Pending
        </button>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details flex flex-column">
      <div class="top flex">
        <div class="left flex flex-column">
          <p><span>#</span>{{ current_data.id }}</p>
          <p>{{ current_data.productDescription }}</p>
        </div>
        <div class="right flex flex-column">
          <p>{{ current_data.billerStreetAddress }}</p>
          <p>{{ current_data.billerCity }}</p>
          <p>{{ current_data.billerZipCode }}</p>
          <p>{{ current_data.billerCountry }}</p>
        </div>
      </div>
      <div class="middle flex">
        <div class="payment flex flex-column">
          <h4>Invoice Date</h4>
          <p>
            {{ current_data.invoiceDate }}
          </p>
          <h4>Payment Date</h4>
          <p>
            {{ current_data.paymentDueDate }}
          </p>
        </div>
        <div class="bill flex flex-column">
          <h4>Bill To</h4>
          <p>{{ current_data.clientName }}</p>
          <p>{{ current_data.clientStreetAddress }}</p>
          <p>{{ current_data.clientCity }}</p>
          <p>{{ current_data.clientZipCode }}</p>
          <p>{{ current_data.clientCountry }}</p>
        </div>
        <div class="send-to flex flex-column">
          <h4>Sent To</h4>
          <p>{{ current_data.clientEmail }}</p>
        </div>
      </div>
      <div class="bottom flex flex-column">
        <div class="billing-items">
          <div class="heading flex">
            <p>Item Name</p>
            <p>QTY</p>
            <p>Price</p>
            <p>Total</p>
          </div>
          <div v-for="(item, index) in current_data.invoiceItemList" :key="index" class="item flex">
            <p>{{ item.name }}</p>
            <p>{{ item.qty }}</p>
            <p>{{ item.price }}</p>
            <p>{{ item.total }}</p>
          </div>
        </div>
        <div class="total flex">
          <p>Amount Due</p>
          <p>{{ current_data.invoiceTotal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase/supabase';
import { ref } from 'vue'
import { useInvoiceModal } from '../stores/counter'
import Loading from '../components/Loading.vue'
export default {
  components: {
    Loading,
  },
  setup() {
    const current_data_loaded = ref(null)
    const current_data = ref([]);
    const route = useRoute();
    const router = useRouter();
    let current_id = route.params.invoice_id;
    const get_current_data = async () => {
      current_data_loaded.value = true;
      const { data: Invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', current_id);
      current_data.value = Invoices[0];
      current_data_loaded.value = false;
    }
    get_current_data();
    const Invoice_model = useInvoiceModal();
    const toggle_edit = () => {
      Invoice_model.toggle_invoice_modal();
      Invoice_model.toggle_edit();
      Invoice_model.current_data_from_edit = current_id;
    }
    if(Invoice_model.update_data){
    get_current_data();
    }
    const delete_invoice = async (id) => {
      current_data_loaded.value = true;
      supabase.from("invoices").delete().eq('id', id)
      current_data_loaded.value = false;
      router.push({ name: 'home' })
    }
    const mark_as_paid = async (id) => {
      current_data_loaded.value = true;
      await supabase.from("invoices").update({ invoicePending: false,invoicePaid : true,invoiceDraft:false })
        .eq('id', id);
      get_current_data();
      current_data_loaded.value = false;

    }
    const mark_as_pending = async (id) => {
      current_data_loaded.value = true;
      await supabase.from("invoices").update({invoicePending: true,invoicePaid : false,invoiceDraft:false }).eq('id', id);
      get_current_data();
      current_data_loaded.value = false;
    }
    return { mark_as_pending , mark_as_paid, delete_invoice, toggle_edit, current_data, current_data_loaded }
  }
}
</script>

<style lang="scss" scoped>
.invoice-view {
  .nav-link {
    margin-bottom: 32px;
    align-items: center;
    color: #fff;
    font-size: 12px;

    img {
      margin-right: 16px;
      width: 7px;
      height: 10px;
    }
  }

  .header,
  .invoice-details {
    background-color: #1e2139;
    border-radius: 20px;
  }

  .header {
    align-items: center;
    padding: 24px 32px;
    font-size: 12px;

    .left {
      align-items: center;

      span {
        color: #dfe3fa;
        margin-right: 16px;
      }
    }

    .right {
      flex: 1;
      justify-content: flex-end;

      button {
        color: #fff;
      }
    }
  }

  .invoice-details {
    padding: 48px;
    margin-top: 24px;

    .top {
      div {
        color: #dfe3fa;
        flex: 1;
      }

      .left {
        font-size: 12px;

        p:first-child {
          font-size: 24px;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 8px;
        }

        p:nth-child(2) {
          font-size: 16px;
        }

        span {
          color: #888eb0;
        }
      }

      .right {
        font-size: 12px;
        align-items: flex-end;
      }
    }

    .middle {
      margin-top: 50px;
      color: #dfe3fa;
      gap: 16px;

      h4 {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
      }

      .bill,
      .payment {
        flex: 1;
      }

      .payment {
        h4:nth-child(3) {
          margin-top: 32px;
        }

        p {
          font-weight: 600;
        }
      }

      .bill {
        p:nth-child(2) {
          font-size: 16px;
        }

        p:nth-child(3) {
          margin-top: auto;
        }

        p {
          font-size: 12px;
        }
      }

      .send-to {
        flex: 2;
      }
    }

    .bottom {
      margin-top: 50px;

      .billing-items {
        padding: 32px;
        border-radius: 20px 20px 0 0;
        background-color: #252945;

        .heading {
          color: #dfe3fa;
          font-size: 12px;
          margin-bottom: 32px;

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }

        .item {
          margin-bottom: 32px;
          font-size: 13px;
          color: #fff;

          &:last-child {
            margin-bottom: 0;
          }

          p:first-child {
            flex: 3;
            text-align: left;
          }

          p {
            flex: 1;
            text-align: right;
          }
        }
      }

      .total {
        color: #fff;
        padding: 32px;
        background-color: rgba(12, 14, 22, 0.7);
        align-items: center;
        border-radius: 0 0 20px 20px;

        p {
          flex: 1;
          font-size: 12px;
        }

        p:nth-child(2) {
          font-size: 28px;
          text-align: right;
        }
      }
    }
  }
}
</style>