<!-- src/components/ImageUpload.vue -->
<template>
    <div class="drop-zone" @dragover.prevent @drop="onDrop">
        <p v-if="!imageSrc">Drag & drop an image here, or click to select one</p>
        <img v-if="imageSrc" :src="imageSrc" alt="Uploaded image" class="uploaded-image" />
        <input type="file" accept="image/*" @change="onFileChange" ref="fileInput" style="display: none;" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'ImageUpload',
    setup() {
        const fileInput = ref<HTMLInputElement | null>(null);
        const imageSrc = ref<string | null>(null);

        const onDrop = (event: DragEvent) => {
            event.preventDefault();
            if (event.dataTransfer?.files) {
                const file = event.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    readFile(file);
                }
            }
        };

        const onFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                const file = target.files[0];
                if (file && file.type.startsWith('image/')) {
                    readFile(file);
                }
            }
        };

        const readFile = (file: File) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageSrc.value = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        };

        return {
            fileInput,
            imageSrc,
            onDrop,
            onFileChange
        };
    }
});
</script>

<style scoped>
.drop-zone {
    width: 300px;
    height: 200px;
    border: 2px dashed #aaa;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.uploaded-image {
    max-width: 100%;
    max-height: 100%;
}
</style>