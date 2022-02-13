<template>
  <div class="restart">
    <p>pontuation: {{ $store.state.game.correctAnswersCounter }}</p>
    <button @click="restartGame">Restart</button>
    <button @click="() => $router.push({ path: '/' })">Menu</button>
  </div>
</template>

<script>
export default {
  name: "Question",
  methods: {
    restartGame() {
      this.$store.commit("setQuestions", []);
      this.$store.state.game.correctAnswersCounter = 0;
    },
  },
};
</script>

<style lang="scss" scoped></style>
