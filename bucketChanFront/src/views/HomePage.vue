<script setup lang="ts">
</script>

<template>
    <v-container fluid class="gradient-bg">


        <v-row class="mt-5 about-us about-title side-margin">
            <p class="text-h5 font-weight-bold">Who are we?</p>
        </v-row>
        <v-row class="about-us side-margin">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem atque vel numquam in fugiat animi
            minima voluptates ipsa explicabo, repellat nostrum dolore cum necessitatibus odio eum ducimus labore
            alias. Odio.
        </v-row>

        <v-row class="mt-10 about-us side-margin about-title">
            <p class="text-h5 font-weight-bold">Boards</p>
        </v-row>
        <v-row class="about-us side-margin">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem atque vel numquam in fugiat animi
            minima voluptates ipsa explicabo, repellat nostrum dolore cum necessitatibus odio eum ducimus labore
            alias. Odio.
        </v-row>

        <v-row class="mt-10 about-us side-margin about-title">
            <p class="text-h5 font-weight-bold">Latest threads</p>
        </v-row>
        <v-row class="about-us about-us side-margin">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem atque vel numquam in fugiat animi
            minima voluptates ipsa explicabo, repellat nostrum dolore cum necessitatibus odio eum ducimus labore
            alias. Odio.
        </v-row>

    </v-container>
</template>

<script lang="ts">

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