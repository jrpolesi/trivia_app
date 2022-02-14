<template>
  <section class="category">
    <h1>Choose a category</h1>
    <ul class="category__list">
      <li
        v-for="(category, index) of categories"
        :key="index"
        :style="{ backgroundColor: category.backgroundColor }"
        @click="redirectToGame(category.id)"
      >
        <h3>{{ category.name }}</h3>
        <img :src="category.image" alt="" />
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "Categories",
  data() {
    return {
      categories: [
        {
          id: 9,
          name: "General Knowledge",
          image: "./assets/icons/all.svg",
          backgroundColor: "#355dcb",
        },
        {
          id: 11,
          name: "Film",
          image: "./assets/icons/film.svg",
          backgroundColor: "#f73838",
        },
        {
          id: 12,
          name: "Music",
          image: "./assets/icons/music.svg",
          backgroundColor: "#3c3c3c",
        },
        {
          id: 15,
          name: "Video Games",
          image: "./assets/icons/game.svg",
          backgroundColor: "#7332a5",
        },
        {
          id: 17,
          name: "Science & Nature",
          image: "./assets/icons/science.svg",
          backgroundColor: "#4f813b",
        },
      ],
    };
  },
  methods: {
    redirectToGame(categoryId) {
      this.$router.push({ name: "Trivia", params: { id: categoryId } });
    },
  },
};
</script>

<style lang="scss" scoped>
.category {
  position: absolute;
  top: 20px;
  left: 50%;
  width: 95%;
  max-width: 1150px;
  transform: translateX(-50%);

  h1 {
    font-size: 45px;
    font-weight: 500;
    color: #444444;
    text-align: center;
    margin: 0px 0 30px;
  }

  .category__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    row-gap: 20px;
    list-style: none;
    padding: 15px 15px 25px;

    li {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      width: 260px;
      height: 190px;
      padding: 15px 10px 20px;
      border-radius: 20px;
      box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.4);
      cursor: pointer;

      h3 {
        display: flex;
        align-items: center;
        color: white;
        font-size: 25px;
        text-align: center;
        font-weight: 500;
        letter-spacing: 0.95px;
        height: 50px;
      }
    }
  }
}
</style>
