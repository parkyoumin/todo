<template>
<div class="app">
  <Header />
  <router-view />
  <Footer />
</div>
</template>

<script>
import Header from "./components/MyHeader.vue";
import Footer from "./components/MyFooter.vue";
export default {
  components: {Header, Footer}
}
</script>


