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
      const categoryId = this.$route.params.id;
      this.$store.dispatch("getGamesfromApi", categoryId);
      this.$store.state.game.correctAnswersCounter = 0;
      this.$store.commit("setIsLoading", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
