<template>
  <section v-if="$store.state.game.isLoading" class="loading">
    <div class="questionMark">
      <div class="questionMark__dot"></div>
    </div>
    <h1>Loading ...</h1>
  </section>
  <div v-if="$store.state.game.questions.length > 0">
    <Question />
  </div>
  <div
    v-else-if="
      $store.state.game.questions.length === 0 && !$store.state.game.isLoading
    "
    class="trivia__startScreen"
  >
    <h1>Are you ready?</h1>
    <button @click="startGame">START</button>
  </div>
</template>

<script>
import Question from "../components/Question.vue";
export default {
  components: { Question },
  name: "Trivia",
  methods: {
    startGame() {
      const categoryId = this.$route.params.id;
      this.$store.commit("setIsLoading", true);
      this.$store.dispatch("getGamesfromApi", categoryId);
    },
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

.loading {
  margin-top: 40vh;
  margin-left: 50vw;
  transform: translate(-50%, -50%);

  h1 {
    text-indent: 20px;
    font-size: 28px;
    text-align: center;
    margin-top: 140px;
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

  @media screen and (min-width: 420px) {
    h1 {
      font-size: 40px;
      margin-top: 150px;
    }
  }
}

.trivia__startScreen {
  width: 95%;
  max-width: 500px;
  margin: 20vh auto;

  h1 {
    text-align: center;
    font-size: 40px;
  }

  button {
    display: block;
    margin: 60px auto;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
    color: white;
    padding: 10px 30px;
    border: none;
    border-radius: 8px;
    background-color: rgb(75, 150, 236);
    cursor: pointer;

    &:hover {
      filter: brightness(1.08);
    }
  }
}
</style>
