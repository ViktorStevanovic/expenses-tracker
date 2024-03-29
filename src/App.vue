<template>
  <main>
    <Home/>
  </main>
</template>
<script>
import Home from './components/Home.vue';
export default {
  name: 'App',
  components:{
    Home,
  },
  data() {
    return {
      
    }
  },
}
</script>
<style lang="scss">
@use './assets/scss/app' as *;

</style>