<template>
  <section>
    <TriviaFinished v-if="$store.state.game.indexCurrentQuestion === 9" />
    <div v-else class="trivia">
      <canvas
        width="70"
        height="70"
        class="responseAnimation"
        v-show="showAnimation"
        ref="triviaResponseAnimation"
      ></canvas>
      <span class="trivia__counter"
        >{{ $store.state.game.indexCurrentQuestion + 1 }} / 10</span
      >
      <div class="trivia__question">
        <p v-html="$store.getters.currentQuestion?.question" />
        <canvas
          width="160"
          height="160"
          class="question__timer"
          ref="timer"
        ></canvas>
        <div class="question__buttons">
          <button
            class="question__button question__button--true"
            :disabled="showAnimation"
            @click="checkResponse"
          >
            True
          </button>
          <button
            class="question__button question__button--false"
            :disabled="showAnimation"
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
      console.log("wrongDraw");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        reverseDrawGuide.finish.x === drawGuide.currentPosition.x &&
        reverseDrawGuide.finish.y === drawGuide.currentPosition.y
      ) {
        drawGuide.isFinish = true;
      }
    },

    drawCorrectAnswer(canvas, ctx, drawGuide) {
      console.log("correctDraw");
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
        start: { x: 10, y: 20 },

        curvePoint: { x: 35, y: 47 },

        finish: { x: 85, y: 5 },

        isFinish: false,

        currentPosition: { x: 10, y: 20 },
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const intervalId = setInterval(() => {
        this.drawCorrectAnswer(canvas, ctx, drawGuide);
        if (drawGuide.isFinish) {
          clearInterval(intervalId);
        }
      }, 25);
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
          clearInterval(intervalId);
        }
      }, 10);
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
          if (this.timer > 0) {
            this.timer--;
          } else {
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
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 50px;
    background-color: white;
    border: 5px solid rgb(85, 85, 85);
    border-radius: 50%;
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

      .question__button {
        width: 115px;
        height: 50px;
        border-radius: 5px;
        border: none;
        background-color: rgb(61, 138, 226);
        color: white;
        font-size: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
