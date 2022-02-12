<template>
  <section>
    <TriviaFinished v-if="$store.state.game.indexCurrentQuestion === 9" />
    <div v-else class="trivia">
      <canvas v-show="showAnimation" ref="triviaResponseAnimation"></canvas>
      <span>{{ $store.state.game.indexCurrentQuestion + 1 }}/ 10</span>
      <div class="trivia__question">
        <p v-html="$store.getters.currentQuestion?.question" />
        <div class="question__timer">{{ timer }}</div>
        <div class="question__buttons">
          <button
            class="question__button question__button--true"
            @click="checkResponse"
          >
            True
          </button>
          <button
            class="question__button question__button--false"
            @click="checkResponse"
          >
            False
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TriviaFinished from "./TriviaFinished.vue";
export default {
  components: { TriviaFinished },
  name: "Question",

  data() {
    return {
      showAnimation: false,
      timer: 10,
      timerIntervalId: null,
    };
  },

  methods: {
    checkResponse({ target: { innerText } }) {
      const correctAnswer = this.$store.getters.currentQuestion.correct_answer;
      this.showAnimation = true;
      if (correctAnswer === innerText) {
        this.$store.state.game.correctAnswersCounter++;
        this.handleCorrectAnswerAnimation();
      } else {
        this.handleWrongAnswerAnimation();
      }
      this.nextQuestion();
    },

    drawWrongAnswer(canvas, ctx, drawGuide) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(drawGuide.start.x, drawGuide.start.y);

      const reverseDrawGuide = {
        start: { x: drawGuide.start.x, y: drawGuide.finish.y },
        finish: { x: drawGuide.finish.x, y: drawGuide.start.y },
      };

      if (drawGuide.nextLine) {
        ctx.lineTo(drawGuide.finish.x, drawGuide.finish.y);

        ctx.moveTo(reverseDrawGuide.start.x, reverseDrawGuide.start.y);
        ctx.lineTo(drawGuide.currentPosition.x, drawGuide.currentPosition.y);

        drawGuide.currentPosition.x +=
          (reverseDrawGuide.finish.x - reverseDrawGuide.start.x) / 10;

        drawGuide.currentPosition.y +=
          (reverseDrawGuide.finish.y - reverseDrawGuide.start.y) / 10;
      } else {
        ctx.lineTo(drawGuide.currentPosition.x, drawGuide.currentPosition.y);
        drawGuide.currentPosition.x +=
          (drawGuide.finish.x - drawGuide.start.x) / 10;

        drawGuide.currentPosition.y +=
          (drawGuide.finish.y - drawGuide.start.y) / 10;
      }

      if (
        Math.trunc(drawGuide.finish.x - drawGuide.currentPosition.x) === 0 &&
        Math.trunc(drawGuide.finish.y - drawGuide.currentPosition.y) === 0
      ) {
        drawGuide.nextLine = true;
        drawGuide.currentPosition.x = reverseDrawGuide.start.x;
        drawGuide.currentPosition.y = reverseDrawGuide.start.y;
      }

      ctx.strokeStyle = "red";
      ctx.lineWidth = "8";
      ctx.stroke();

      if (
        reverseDrawGuide.finish.x === drawGuide.currentPosition.x - 4.5 &&
        reverseDrawGuide.finish.y === drawGuide.currentPosition.y + 6
      ) {
        drawGuide.isFinish = true;
      }
    },

    drawCorrectAnswer(canvas, ctx, drawGuide) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(drawGuide.start.x, drawGuide.start.y);

      if (drawGuide.currentPosition.x > drawGuide.curvePoint.x - 1) {
        ctx.lineTo(drawGuide.curvePoint.x, drawGuide.curvePoint.y);
        ctx.lineTo(drawGuide.currentPosition.x, drawGuide.currentPosition.y);

        drawGuide.currentPosition.x +=
          (drawGuide.finish.x - drawGuide.curvePoint.x) / 10;

        drawGuide.currentPosition.y +=
          (drawGuide.finish.y - drawGuide.curvePoint.y) / 10;
      } else {
        ctx.lineTo(drawGuide.currentPosition.x, drawGuide.currentPosition.y);

        drawGuide.currentPosition.x +=
          (drawGuide.curvePoint.x - drawGuide.start.x) / 10;

        drawGuide.currentPosition.y +=
          (drawGuide.curvePoint.y - drawGuide.start.y) / 10;
      }

      ctx.strokeStyle = "green";
      ctx.lineWidth = "8";
      ctx.stroke();

      if (
        drawGuide.finish.x === Math.trunc(drawGuide.currentPosition.x) &&
        drawGuide.finish.y === Math.trunc(drawGuide.currentPosition.y)
      ) {
        drawGuide.isFinish = true;
      }
    },

    handleWrongAnswerAnimation() {
      const canvas = this.$refs.triviaResponseAnimation;
      const ctx = canvas.getContext("2d");

      const drawGuide = {
        start: { x: 10, y: 0 },

        finish: { x: 55, y: 60 },

        currentPosition: { x: 10, y: 0 },

        nextLine: false,

        isFinish: false,
      };

      const intervalId = setInterval(() => {
        this.drawWrongAnswer(canvas, ctx, drawGuide);
        if (drawGuide.isFinish) {
          clearInterval(intervalId);
        }
      }, 25);
    },

    handleCorrectAnswerAnimation() {
      const canvas = this.$refs.triviaResponseAnimation;
      const ctx = canvas.getContext("2d");

      const drawGuide = {
        start: { x: 0, y: 20 },

        curvePoint: { x: 25, y: 47 },

        finish: { x: 75, y: 5 },

        isFinish: false,

        currentPosition: { x: 0, y: 20 },
      };

      const intervalId = setInterval(() => {
        this.drawCorrectAnswer(canvas, ctx, drawGuide);
        if (drawGuide.isFinish) {
          clearInterval(intervalId);
        }
      }, 25);
    },

    nextQuestion() {
      setTimeout(() => {
        if (this.$store.state.game.indexCurrentQuestion < 9) {
          this.$store.commit("nextQuestion");
          this.showAnimation = false;
          this.timer = 10;
        }
      }, 1500);
    },
  },

  watch: {
    "$store.state.game.indexCurrentQuestion": {
      handler: function () {
        if (this.timerIntervalId) {
          clearInterval(this.timerIntervalId);
          this.timerIntervalId = 10;
        }

        this.timerIntervalId = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
          } else {
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
            this.nextQuestion();
          }
        }, 1000);
        console.log(this.$store.state.game.indexCurrentQuestion);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.trivia__question {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: 24px;
    text-align: center;
    padding: 15px;
  }

  .question__buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .question__button {
      width: 100px;
      height: 40px;
      border-radius: 5px;
      border: none;
      background-color: rgb(61, 138, 226);
      color: white;
      font-size: 22px;
      cursor: pointer;
    }
  }
}
</style>
