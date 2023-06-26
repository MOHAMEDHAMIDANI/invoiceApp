<template>
  <div class="">
    <div v-if="!mobile" class="app flex flex-column ">
      <Navigation />
      <div class="app-content flex flex-column">
        <Transition name="invoice">
          <InvoiceModel v-if="Invoice_model.invoice_Modal" />
        </Transition>
        <router-view />
      </div>
    </div>
    <div class="mobile-message flex flex-column" v-else>
      <h2>Sorry, this app is not supported on Mobile Devices</h2>
      <p>To use this app, please use a computer or Tablet {{ Invoice_model.invoice_Modal.value }}</p>
    </div>
  </div>
</template>

<script>
import { useInvoiceModal } from './stores/counter';
import InvoiceModel from './components/InvoiceModal.vue';
import Navigation from './components/Navigation.vue';
import { ref } from 'vue';
export default {
  components: {
    Navigation,
    InvoiceModel,
  },
  setup() {
    const Invoice_model = useInvoiceModal();
    const mobile = ref(null);
    window.addEventListener('resize', () => {
      Check_Screen();
    });
    const Check_Screen = () => {
      const window_width = window.innerWidth;
      if (window_width < 750) {
        mobile.value = true;
        return
      }
      mobile.value = false;
    }
    Check_Screen();

    // get date for invoice

    return { mobile, Invoice_model }
  },
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.app {
  background-color: #141625;
  min-height: 100vh;

  @media (min-width: 900px) {
    flex-direction: row !important;
  }

  .app-content {
    padding: 0 20px;
    flex: 1;
    position: relative;
  }
}

.mobile-message {
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #141625;
  color: #fff;

  p {
    margin-top: 16px;
  }
}

// animation 
.invoice-enter-active,
.invoice-leave-active {
  transition: opacity 1s ease;
}

.invoice-enter-from,
.invoice-leave-to {
  opacity: 0;

}

button,
.button {
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 30px;
  border: none;
  font-size: 12px;
  margin-right: 8px;
  color: #fff;
}

.dark-purple {
  background-color: #252945;
}

.red {
  background-color: #ec5757;
}

.purple {
  background-color: #7c5dfa;
}

.green {
  background-color: #33d69f;
}

.orange {
  background-color: #ff8f00;
}

// utility classes

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.container {
  width: 100%;
  padding: 40px 10px;
  max-width: 850px;
  margin: 0 auto;

  @media (min-width: 900px) {
    padding-top: 72px;
  }
}

.nav-link {
  text-decoration: none;
  color: initial;
}

// Status Button Styling

.status-button {
  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }

  font-size: 12px;
  margin-right: 30px;
  align-items: center;
  padding: 8px 30px;
  border-radius: 10px;
}

.paid {
  &::before {
    background-color: #33d69f;
  }

  color: #33d69f;
  background-color: rgba(51, 214, 160, 0.1);
}

.pending {
  &::before {
    background-color: #ff8f00;
  }

  color: #ff8f00;
  background-color: rgba(255, 145, 0, 0.1);
}

.draft {
  &::before {
    background-color: #dfe3fa;
  }

  color: #dfe3fa;
  background-color: rgba(223, 227, 250, 0.1);
}</style>
