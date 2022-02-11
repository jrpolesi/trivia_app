<template>
  <section v-if="isLoading" class="loading"></section>
  <section v-else class="question">
    <div v-if="indexCurrentQuestion === 9" class="restart">
      <p>pontuation: {{ correctAnswersCounter }}</p>
      <button @click="restartGame">Restart</button>
      <button @click="() => $router.push({ path: '/' })">Menu</button>
    </div>
    <div ref="trivia" v-else>
      <span>{{ indexCurrentQuestion + 1 }}/ 10</span>
      <div>
        <p v-html="currentQuestion?.question" />
        <button @click="checkResponse">True</button>
        <button @click="checkResponse">False</button>
      </div>
    </div>
  </section>
</template>

<script>
function generateApiURL(categoryId) {
  return `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=boolean`;
}

export default {
  name: "Trivia",

  data() {
    return {
      questions: [],
      isLoading: true,
      indexCurrentQuestion: 0,
      correctAnswersCounter: 0,
    };
  },

  methods: {
    checkResponse({ target: { innerText } }) {
      const correctAnswer = this.currentQuestion.correct_answer;
      if (correctAnswer === innerText) {
        this.correctAnswersCounter++;
        this.$refs.trivia.classList.add("correctAnswer");
      } else {
        this.$refs.trivia.classList.add("wrongAnswer");
      }
      this.nextQuestion();
    },

    nextQuestion() {
      setTimeout(() => {
        if (this.indexCurrentQuestion < 9) {
          this.indexCurrentQuestion++;
          this.$refs.trivia.classList.remove("wrongAnswer", "correctAnswer");
        }
      }, 1000);
    },

    restartGame() {
      this.questions = [];
      this.isLoading = true;
      this.indexCurrentQuestion = 0;
      this.correctAnswersCounter = 0;
      this.getGamesfromApi();
    },

    async getGamesfromApi() {
      const categoryId = this.$route.params.id;
      const res = await fetch(generateApiURL(categoryId));
      const data = await res.json();

      const questions = data.results;

      this.questions = questions;
      this.indexCurrentQuestion = 0;
      this.isLoading = false;
    },
  },

  async beforeMount() {
    this.getGamesfromApi();
  },

  computed: {
    currentQuestion: function () {
      return this.questions[this.indexCurrentQuestion];
    },
  },
};
</script>

<style lang="sass" scoped></style>
