<template>
  <div>
    <router-link :to="{ name: 'sentence', params: { assessmentType: 'word' }}" tag="button">단어</router-link>
    <router-link :to="{ name: 'sentence', params: { assessmentType: 'sentence' }}" tag="button">장문</router-link>
    <router-link :to="{ name: 'game' }" tag="button">게임</router-link>
  </div>
</template>

<script>
export default{
  beforeCreate() {

  }
}
</script>
