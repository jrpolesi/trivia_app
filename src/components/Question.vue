<template>
  <section>
    <TriviaFinished v-if="$store.state.game.indexCurrentQuestion === 9" />
    <div v-else class="trivia">
      <span class="trivia__counter"
        >{{ $store.state.game.indexCurrentQuestion + 1 }} / 10</span
      >
      <div class="trivia__question">
        <p v-html="$store.getters.currentQuestion?.question" />
        <canvas
          v-show="showAnimation"
          class="responseAnimation"
          ref="triviaResponseAnimation"
        ></canvas>
        <canvas
          v-show="!showAnimation"
          width="160"
          height="160"
          class="question__timer"
          ref="timer"
        ></canvas>
        <div class="question__buttons">
          <button
            class="question__button question__button--true"
            :disabled="showAnimation || timer < 1"
            @click="checkResponse"
          >
            True
          </button>
          <button
            class="question__button question__button--false"
            :disabled="showAnimation || timer < 1"
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
      timer: undefined,
      timerIntervalId: null,
    };
  },

  methods: {
    checkResponse({ target: { innerText } }) {
      this.showAnimation = true;
      const correctAnswer = this.$store.getters.currentQuestion.correct_answer;
      if (correctAnswer === innerText) {
        this.$store.state.game.correctAnswersCounter++;
        this.handleCorrectAnswerAnimation();
      } else {
        this.handleWrongAnswerAnimation();
      }
      this.nextQuestion();
    },

    drawWrongAnswer(canvas, ctx, drawGuide) {
      const reverseDrawGuide = {
        start: { x: drawGuide.start.x, y: drawGuide.finish.y },
        finish: { x: drawGuide.finish.x, y: drawGuide.start.y },
      };
      if (
        reverseDrawGuide.finish.x === drawGuide.currentPosition.x &&
        reverseDrawGuide.finish.y === drawGuide.currentPosition.y
      ) {
        drawGuide.isFinish = true;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(drawGuide.start.x, drawGuide.start.y);

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
      ctx.lineWidth = "13";
      ctx.stroke();
    },

    drawCorrectAnswer(canvas, ctx, drawGuide) {
      if (
        drawGuide.finish.x === Math.trunc(drawGuide.currentPosition.x) &&
        drawGuide.finish.y === Math.trunc(drawGuide.currentPosition.y)
      ) {
        drawGuide.isFinish = true;
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      ctx.lineWidth = "13";
      ctx.stroke();
    },

    handleWrongAnswerAnimation() {
      const canvas = this.$refs.triviaResponseAnimation;
      const ctx = canvas.getContext("2d");

      const drawGuide = {
        start: { x: 5, y: 5 },

        finish: { x: 105, y: 105 },

        currentPosition: { x: 5, y: 5 },

        nextLine: false,

        isFinish: false,
      };

      canvas.width = drawGuide.finish.x + 5;
      canvas.height = drawGuide.finish.y + 5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        start: { x: 5, y: 25 },

        curvePoint: { x: 45, y: 62 },

        finish: { x: 120, y: 5 },

        isFinish: false,

        currentPosition: { x: 5, y: 25 },
      };

      canvas.width = drawGuide.finish.x + 5;
      canvas.height = drawGuide.curvePoint.y + 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const intervalId = setInterval(() => {
        this.drawCorrectAnswer(canvas, ctx, drawGuide);
        if (drawGuide.isFinish) {
          clearInterval(intervalId);
        }
      }, 20);
    },
    drawTimer() {
      const canvas = this.$refs.timer;
      const ctx = canvas.getContext("2d");
      let currentPosition = 2.5;
      const drawCircle = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(80, 80, 70, 0, 2 * Math.PI);
        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = "12";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(80, 80, 70, 1.6, currentPosition * Math.PI);
        ctx.strokeStyle = "#00d2be";
        ctx.lineWidth = "12";
        ctx.stroke();

        ctx.font = "38px arial";
        ctx.textAlign = "center";
        ctx.fillText(this.timer, 80, 90);

        currentPosition -= 0.002;
      };

      const intervalId = setInterval(() => {
        if (this.showAnimation) clearInterval(intervalId);
        if (this.timer > 0) {
          drawCircle();
        } else {
          drawCircle();
          clearInterval(intervalId);
        }
      }, 10);
    },

    nextQuestion() {
      setTimeout(() => {
        if (this.$store.state.game.indexCurrentQuestion < 9) {
          this.showAnimation = false;
          this.timer = 10;
          this.$store.commit("nextQuestion");
        }
      }, 1500);
    },
  },

  mounted() {
    this.drawTimer();
  },

  watch: {
    "$store.state.game.indexCurrentQuestion": {
      handler: function () {
        if (this.timerIntervalId) {
          clearInterval(this.timerIntervalId);
        }
        if (this.timer === 10) this.drawTimer();

        this.timer = 10;

        this.timerIntervalId = setInterval(() => {
          if (this.timer > 0 && !this.showAnimation) {
            this.timer--;
          } else if (this.timer === 0) {
            this.timer--;
            clearInterval(this.timerIntervalId);
            this.timerIntervalId = null;
            this.nextQuestion();
          }
        }, 1000);
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.trivia {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: auto;
  padding: 20px 15px;
  max-width: 640px;

  .responseAnimation {
    padding: 50px;
  }

  .trivia__counter {
    display: block;
    font-size: 22px;
    font-weight: 500;
    align-self: flex-end;
  }

  .trivia__question {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 50px;
    height: 90vh;
    max-height: 600px;

    p {
      font-size: 26px;
      text-align: center;
    }

    .question__buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding-bottom: 20px;

      .question__button {
        width: 115px;
        height: 50px;
        border-radius: 5px;
        border: none;
        background-color: rgb(61, 138, 226);
        color: white;
        font-size: 24px;
        cursor: pointer;

        &:hover {
          filter: brightness(1.08);
        }
      }
    }
  }
}
</style>
