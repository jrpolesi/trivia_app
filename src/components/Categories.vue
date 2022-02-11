<template>
  <section>
    <ul class="categoryList">
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
          backgroundColor: "blue",
        },
        {
          id: 11,
          name: "Film",
          image: "./assets/icons/film.svg",
          backgroundColor: "red",
        },
        {
          id: 12,
          name: "Music",
          image: "./assets/icons/music.svg",
          backgroundColor: "grey",
        },
        {
          id: 15,
          name: "Video Games",
          image: "./assets/icons/game.svg",
          backgroundColor: "purple",
        },
        {
          id: 17,
          name: "Science & Nature",
          image: "./assets/icons/science.svg",
          backgroundColor: "orange",
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
.categoryList {
  display: flex;
  justify-content: center;
  gap: 10px;
  list-style: none;
  padding: 0;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 200px;
    height: 180px;
    padding: 10px 0 15px;
    border-radius: 10px;
    cursor: pointer;

    h3 {
      display: flex;
      align-items: center;
      color: white;
      font-size: 25px;
      text-align: center;
      height: 50px;
    }
  }
}
</style>
