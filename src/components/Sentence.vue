<template>
  <div>
    <div v-for="sentence of sentences">
      {{ sentence.body }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['assessmentType'],
  data () {
    return {
      sentences: null
    }
  },
  beforeMount () {
    fetch(`https://acidrain.azurewebsites.net/sentences/?assessment_type=${this.assessmentType}&difficulty=1&sentence_count=5`)
    .then(result => {
      return result.text()
    })
    .then(result => {
      result = JSON.parse(result)

      if (result.success) {
        this.sentences = result.sentences
      }
    })
  }
}
</script>
