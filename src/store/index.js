import { createStore } from "vuex";

function generateApiURL(categoryId) {
  return `https://opentdb.com/api.php?amount=10&category=${categoryId}&type=boolean`;
}

export default createStore({
  state: {
    user: {
      name: "",
      points: 0,
    },
    game: {
      questions: [],
      isLoading: true,
      showAnimation: false,
      indexCurrentQuestion: undefined,
      correctAnswersCounter: 0,
    },
  },

  mutations: {
    setQuestions(state, questionsFromApi) {
      state.game.questions = questionsFromApi;
    },

    setIndexCurrentQuestion(state, index) {
      state.game.indexCurrentQuestion = index;
    },

    setIsLoading(state, isLoading) {
      state.game.isLoading = isLoading;
    },

    nextQuestion(state) {
      state.game.indexCurrentQuestion++;
    },
  },

  actions: {
    getGamesfromApi({ commit }, categoryId) {
      setTimeout(async () => {
        const res = await fetch(generateApiURL(categoryId));
        const data = await res.json();

        const questions = data.results;

        commit("setQuestions", questions);
        commit("setIndexCurrentQuestion", 0);
        commit("setIsLoading", false);
      }, 1500);
    },
  },

  modules: {},
  getters: {
    currentQuestion: function (state) {
      return state.game.questions[state.game.indexCurrentQuestion];
    },
  },
});
