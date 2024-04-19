<template>
   <main>
      <!-- <Home />
      <Analytics /> -->
      <router-view></router-view>
   </main>
</template>
<script>
   import Analytics from "./components/Analytics.vue";
   import Home from "./components/Home.vue";
   import Transactions from "./components/Transactions.vue";
   export default {
      name: "App",
      components: {
         Home,
         Analytics,
         Transactions,
      },
      data() {
         return {};
      },
   };
</script>
<style lang="scss">
   @use "./assets/scss/app" as *;
</style>
