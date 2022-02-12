<template>
  <section v-if="$store.state.game.isLoading" class="loading">
    <div class="questionMark">
      <div class="questionMark__dot"></div>
    </div>
  </section>
  <Question v-else />
</template>

<script>
import Question from "../components/Question.vue";
export default {
  components: { Question },
  name: "Trivia",

  async mounted() {
    const categoryId = this.$route.params.id;
    this.$store.dispatch("getGamesfromApi", categoryId);
  },
};
</script>

<style lang="scss" scoped>
@keyframes jumpQuestionMark {
  from {
    transform: translateY(25%) scaleY(0.95);
  }

  30% {
    transform: translateY(40%) scaleY(0.85);
  }

  60% {
    transform: translateY(5%) scaleY(1.01);
  }

  to {
    transform: translateY(25%) scaleY(0.95);
  }
}

.questionMark {
  position: relative;
  width: 100px;
  height: 100px;
  border: 15px solid red;
  margin: auto;
  border-radius: 50%;
  animation: jumpQuestionMark 1.5s infinite;

  &::after {
    content: "";
    position: absolute;
    left: -15px;
    bottom: -20px;
    width: 60px;
    height: 50px;
    background-color: white;
  }

  &::before {
    content: "";
    position: absolute;
    top: 68.5px;
    left: 27.8px;
    width: 0px;
    height: 30px;
    border-top: 15px solid red;
    border-left: 18px solid red;
    margin: auto;
    border-radius: 100% 0 0 0;
    z-index: 2;
  }

  .questionMark__dot {
    position: absolute;
    top: 120px;
    left: 37px;
    width: 25px;
    height: 25px;
    background-color: red;
    border-radius: 50%;
    transform: translateX(-50%);
  }
}
</style>
