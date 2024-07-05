<script setup lang="ts">
import axios from 'axios';
</script>

<template>
    <a href="" @click.prevent="dialog = true">No. {{
        shownId
    }}</a>
    <v-dialog v-model="dialog" width="50%">
        <v-card title="Responder a un hilo">
            <v-container fluid>
                <v-form @submit.prevent="createResponse()" v-model="dataValid">
                    <!-- <v-row justify="center">
                        <v-col cols="12" :sm="4" justify="center">
                            Title:
                        </v-col>
                        <v-col cols="12" :sm="8">
                            <v-text-field v-model="responseData.title" :rules="[rules.lenMin(2)]"> </v-text-field>
                        </v-col>
                    </v-row> -->

                    <v-row justify="center">
                        <v-col cols="12" :sm="4">
                            Body:
                        </v-col>
                        <v-col cols="12" :sm="8">
                            <v-textarea v-model="responseData.body" :rules="[rules.lenMin(2)]"> </v-textarea>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" :sm="4">
                            Sage:
                        </v-col>
                        <v-col cols="12" :sm="8">
                            <v-checkbox v-model="responseData.sage"> </v-checkbox>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols="12" :sm="4">
                            Image:
                        </v-col>
                        <v-col cols="12" :sm="8">
                            <input type="file" class="input-file btn-anistore" accept="image/png, image/jpeg, image/gif"
                                multiple="true" ref="imagePicker" v-on:change="loadFile($event)" id="uploadImages" />
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-btn color="blue" type="submit" :disabled="!dataValid">
                            Submit
                        </v-btn>
                    </v-row>

                </v-form>
            </v-container>
        </v-card>
    </v-dialog>
</template>


<script lang="ts">
export default {
    data() {
        return {
            responseData: {
                title: "",
                boardShortName: this.boardShortName,
                body: `${this.mention ? ">>" + this.mention + "" : ""}`,
                media: [] as any[],
                sage: false,
                threadId: this.threadId,
            },
            responseRawImages: [] as any[],
            dataValid: false,
            dialog: false,
            rules: { lenMin: (lenMin: number) => (v: string | any[]) => ((v || "").length >= lenMin) || `Mínimo ${lenMin} caracteres` }
        }
    },
    props: {
        threadId: {
            type: Number,
            required: true,
        },
        shownId: {
            type: Number,
            required: true,
        },
        boardShortName: {
            type: String,
            required: true
        },
        mention: {
            type: String,
            required: false
        }
    },
    methods: {
        loadFile(event: any) {
            //var self = this;
            console.log("event ", JSON.stringify(event));


            this.responseData.media.length = 0;
            this.responseRawImages.length = 0;
            let imagePickerData: any = this.$refs.imagePicker;
            Array.from(imagePickerData.files).forEach((image: any) => {

                let imageSrc = URL.createObjectURL(image as Blob);
                let imageName = image.name as string;
                let img = {
                    filename: imageName,
                }
                this.responseData.media.push(img);

                this.responseRawImages.push(image);


            });
            this.$emit("imagesSelected", imagePickerData.files);
        },
        createResponse() {
            let form = new FormData();
            console.log("newResponse ", JSON.stringify(this.responseData))
            form.append("newResponse", JSON.stringify(this.responseData))

            this.responseRawImages.forEach((image) => {
                form.append("mediaFiles", image)
            })


            axios.post(`http://${window.location.hostname}:3000/board/${this.responseData.boardShortName}/${this.threadId}/answer`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",

                    //"Access-Control-Allow-Origin": "*",
                },
            }).then((response) => {
                location.reload()
            }).catch((error) => {
                console.error(error)
                if (error.response.status == 406) {
                    alert("Post repetido en r9k!")
                }
            })

        },
    }



}
</script>