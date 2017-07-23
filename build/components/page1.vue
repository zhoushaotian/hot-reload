<template>
  <div>
    <p>this page12222</p>
    <span>now the count is {{count}}</span>
    <span>now the getters is {{getterCount}}</span>
    <button @click="change(10)">add 10</button>
    <router-link to="/">GO to index</router-link>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
export default {
  name: 'page1',
  computed: {
    count () {
      return this.$store.state.count;
    },
    getterCount () {
      return this.$store.getters.msg;
    }
  },
  methods: {
    ...mapMutations({
      change: 'increat'
    })
  }
};

</script>
<style >

</style>
