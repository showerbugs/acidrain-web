<template>
  <div>
    <v-toolbar class="green">
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <router-link :to="{name: 'home'}" tag="v-toolbar-title" class="title-home white--text">Acid Rain</router-link>
    </v-toolbar>
    <!--<div v-for="bucket in userBuckets" :key="bucket['.key']">-->
      <!--<router-link :to="{name: 'links', redirect: true, params: {bucketId: bucket['.key']}}">-->
            <!--<div>{{bucket.name}}</div>-->
      <!--</router-link>-->
    <!--</div>-->
  </div>
</template>

<script>

  export default {
    data() {
      return {
        drawer: false,
        mini: false,
        user: null
      }
    },
    methods: {
    },
    beforeCreate() {

    }
  }
</script>

<style>
.title-home {
  cursor: pointer;
}
</style>
