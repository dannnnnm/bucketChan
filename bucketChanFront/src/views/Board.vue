<script setup lang="ts">
import ResponsePanel from '@/components/ResponsePanel.vue';
import ImageUpload from '@/components/ImageUpload.vue';
</script>

<template>
    <v-container fluid class="mx-5">
        <v-row justify="center" class="mb-5">
            <h1 class="text-h2 text-center">/{{ boardDetails.shortName }}/ - {{ boardDetails.name }}</h1>
        </v-row>

        <template v-for="(thread, index) in threads" class="mb-10">
            <div :id="`p${thread.id}`"></div>
            <v-row align="center" class="ml-5 right-short aqua-bg">
                <span class="text-h4 pr-5">{{ thread.title }} </span class="text-h4">
                <ResponsePanel :threadId="thread.id" :shownId="thread.id" :boardShortName="boardDetails.shortName" />
            </v-row>
            <v-row class="ml-5 right-short aqua-bg mb-5">
                <v-col cols="12" :sm="3">
                    <v-img :src="getMedia(thread.media[0])" alt="" height=auto></v-img>
                </v-col>
                <v-col cols="12" :sm="9">
                    <div style="white-space: pre;" v-html="replaceMentionsWithAnchors(thread.body)"></div>
                </v-col>
            </v-row>

            <v-row class="ml-15 right-short aqua-bg mb-5" v-for="(response, index) in thread.responses">
                <div :id="`p${response.id}`"></div>

                <v-col cols="12" :sm="3">


                    <v-img :src="getMedia(response.media[0])" alt="" height=auto></v-img>
                </v-col>
                <ResponsePanel :threadId="thread.id" :shownId="response.id" :boardShortName="boardDetails.shortName"
                    :mention="response.id">
                </ResponsePanel>

                <v-col cols="12" :sm="9">
                    <div style="white-space: pre;" v-html="replaceMentionsWithAnchors(response.body)"></div>
                </v-col>
            </v-row>

        </template>

        <v-row justify="center" v-if="!showNewPostForm">
            <v-btn color="red" @click="showNewPostForm = true">
                Nuevo post
            </v-btn>

        </v-row>

        <v-form @submit.prevent="createPost()" v-model="dataValid" v-else>
            <v-row justify="center">
                <v-col cols="12" :sm="3">
                    Title:
                </v-col>
                <v-col cols="12" :sm="3">
                    <v-text-field v-model="newPost.title" :rules="[rules.lenMin(2)]"> </v-text-field>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" :sm="3">
                    Body:
                </v-col>
                <v-col cols="12" :sm="3">
                    <v-textarea v-model="newPost.body" :rules="[rules.lenMin(2)]"> </v-textarea>
                </v-col>
            </v-row>

            <!--<v-row justify="center">
            <v-col cols="12" :sm="3">
                Sage:
            </v-col>
            <v-col cols="12" :sm="3">
                <v-checkbox v-model="newPost.sage"> </v-checkbox>
            </v-col>
        </v-row>-->

            <v-row justify="center">
                <v-col cols="12" :sm="3">
                    Image:
                </v-col>
                <v-col cols="12" :sm="3">
                    <input type="file" class="input-file btn-anistore" accept="image/png, image/jpeg, image/gif"
                        multiple="true" ref="imagePicker" v-on:change="loadFile($event)" id="uploadImages" />
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" :sm="3">
                    <ImageUpload shortName="boardDetails.shortName" />
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-btn color="blue" type="submit" :disabled="!dataValid">
                    Submit
                </v-btn>
            </v-row>

        </v-form>
    </v-container>

</template>




<script lang="ts">
import axios from 'axios';

export default {
    data() {
        return {
            boardDetails: {} as any,
            threads: [] as any[],
            showNewPostForm: false,
            dataValid: false,
            newPost: {
                boardShortName: "",
                title: "",
                body: "",
                //sage: "",
                media: [] as any[]
            },
            newPostRawImages: [] as any[],
            mediaFiles: [] as any[],
            rules: { lenMin: (lenMin: number) => (v: string | any[]) => ((v || "").length >= lenMin) || `Mínimo ${lenMin} caracteres` }
        }
    },
    mounted() {
        let shortName = this.$route.params.shortName
        axios.get(`http://${window.location.hostname}:3000/board/${shortName}`).then((response) => {
            this.boardDetails = { shortName: response.data.shortName, name: response.data.name }
            response.data.threads.forEach((thread: any) => {
                console.log("pushn ", thread)
                this.threads.push(thread);
            });
        });
    },
    methods: {
        loadFile(event: any) {
            //var self = this;
            console.log("event ", JSON.stringify(event));


            this.newPost.media.length = 0;
            this.newPostRawImages.length = 0;
            let imagePickerData: any = this.$refs.imagePicker;
            Array.from(imagePickerData.files).forEach((image: any) => {

                let imageSrc = URL.createObjectURL(image as Blob);
                let imageName = image.name as string;
                let img = {
                    filename: imageName,
                }
                this.newPost.media.push(img);

                this.newPostRawImages.push(image);


            });
            this.$emit("imagesSelected", imagePickerData.files);
        },
        createPost() {
            let form = new FormData();
            this.newPost.boardShortName = this.boardDetails.shortName;
            form.append("newThread", JSON.stringify(this.newPost))

            this.newPostRawImages.forEach((image) => {
                form.append("mediaFiles", image)
            })


            axios.post(`http://${window.location.hostname}:3000/board/${this.boardDetails.shortName}/newThread`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",

                    //"Access-Control-Allow-Origin": "*",
                },
            }).then((response) => location.reload()).catch((error) => {
                console.error(error)
                if (error.response.status == 406) {
                    alert("Post repetido en r9k!")
                }
            })

        },
        getMedia(media: { filename: string, hash: string }): string {
            if (!media) return "";
            console.log("media ", media)
            return `http://${window.location.hostname}:3000/${media.hash}/${media.filename}`
        },
        replaceMentionsWithAnchors(text: string): string {
            let mentions = text.replace(/(>>\d+)/g, `<a  href="#$1">$1</a>`).replace('href="#>>', 'href="#p');
            let greentext = mentions.replace(/(^>(?!>).*)/gm, `<span class="text-green">$1</span>`)
            return greentext
        }
    },

}
</script>

<style scoped>
.aqua-bg {
    background-color: aqua !important;
}

.right-short {
    margin-right: 25vw;
}
</style>