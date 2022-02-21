<template>
  <div class="restart">
    <div class="restart__result">
      <p>You've got</p>
      <span>{{ $store.state.game.correctAnswersCounter }} / 10</span>
      <p>correct!</p>
    </div>
    <div class="restart__buttons">
      <button @click="restartGame">Restart</button>
      <button @click="goToMenu">Menu</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Question",
  props: ["timerIntervalId"],
  methods: {
    restartGame() {
      clearInterval(this.timerIntervalId);
      this.$store.commit("setQuestions", []);
      this.$store.commit("setCorrectAnswersCounter", 0);
    },

    goToMenu() {
      clearInterval(this.timerIntervalId);
      this.$store.commit("setQuestions", []);
      this.$store.commit("setCorrectAnswersCounter", 0);
      this.$store.commit("setIndexCurrentQuestion", undefined);
      this.$store.commit("setIsLoading", false);
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style lang="scss" scoped>
.restart {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);

  .restart__result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 20px 5px;

    p {
      font-size: 50px;
    }
    span {
      font-size: 40px;

      &::first-letter {
        font-size: 155px;
      }
    }
  }

  .restart__buttons {
    display: flex;
    justify-content: center;
    gap: 35px;
    padding-bottom: 20px;
    margin-top: 60px;

    button {
      width: 125px;
      font-size: 28px;
      padding: 13px 0;
      background-color: rgb(61, 138, 226);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;

      &:hover {
        filter: brightness(1.08);
      }
    }
  }
}
</style>
