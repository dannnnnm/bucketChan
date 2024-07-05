<script setup lang="ts">
import axios from 'axios';
</script>

<template>
  <v-container fluid class="gradient-bg">
    <v-row class="mt-5 about-us about-title side-margin">
      <p class="text-h5 font-weight-bold">Who are we?</p>
    </v-row>
    <v-row class="about-us side-margin">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem atque vel numquam in
      fugiat animi minima voluptates ipsa explicabo, repellat nostrum dolore cum necessitatibus odio
      eum ducimus labore alias. Odio.
    </v-row>

    <v-row class="mt-10 about-us side-margin about-title">
      <p class="text-h5 font-weight-bold">Boards</p>
    </v-row>
    <v-row class="about-us side-margin">
      <v-row v-for="row in totalRows">
        <v-col cols="12" :sm="3" v-for="board in getRow(row)">
          <a :href="'/board/' + board.shortName">/{{ board.shortName }}/ - {{ board.name }}</a>
        </v-col>
      </v-row>
    </v-row>

    <v-row class="mt-10 about-us side-margin about-title">
      <p class="text-h5 font-weight-bold">Chats</p>
    </v-row>

    <v-row class="about-us side-margin">
      <v-row v-for="row in totalRows">
        <v-col cols="12" :sm="3" v-for="board in getRow(row)">
          <a :href="'/badChat/' + board.shortName">/{{ board.shortName }}/ - {{ board.name }}</a>
        </v-col>
      </v-row>
    </v-row>

  </v-container>
</template>

<script lang="ts">
export default {
  data() {
    return {
      boards: [] as any[],
      boardsPerRow: 4,
      totalRows: 0,
    }
  },
  mounted() {
    axios.get(`http://${window.location.hostname}:3000/board/boards`, {
      headers: {
        "Content-Type": "application/json",

        //"Access-Control-Allow-Origin": "*",
      }
    }).then((response) => {
      this.boards = response.data
      this.totalRows = Math.ceil(this.boards.length / this.boardsPerRow);

    })


  },
  methods: {
    getRow(row: number) {
      row--;
      let lower = row * this.boardsPerRow
      let upper = lower + this.boardsPerRow
      upper = upper >= this.boards.length ? this.boards.length : upper
      //console.log("amount of articles ", this.articles.length)
      //console.log(`getting between ${lower} and ${upper}`)
      return this.boards.slice(lower, upper)

    }
  }
}
</script>

<style scoped>
.gradient-bg {
  background-image: linear-gradient(lightblue, lightskyblue);
}

.about-us {
  padding-left: 0.5vw;
  background-color: white;
}

.side-margin {
  margin-left: 20vw;
  margin-right: 20vw;
}

.about-title {
  background-color: blue;
  color: white;
}
</style>
