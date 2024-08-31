<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { user } from "../../mixins/authMixin";
import { Head } from "@unhead/vue/components";
import axios from "axios";
import Separator from "@/components/Separator.vue";
import Cookies from "js-cookie";


const route = useRoute();
const bookData = ref(null);
const chapterData = ref(null);
const id = route.params.chapterId;
const fontSize = ref(Cookies.get("fontSize") || 18);
const viewRecorded = ref(false);
//Setting if for the API call
const bookId = route.params.bookId;
const chapterId = route.params.chapterId;
const likesCount = ref(0);
const paragraphsId = ref(1);
const API_URL = import.meta.env.VITE_APP_API;

const fetchABook = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/book/${bookId}/chapter/${chapterId}`
    );
    bookData.value = data;
    chapterData.value = formatTextLikeBook(data.body);
  } catch {
    console.error("Error fetching book");
  }
};

function formatTextLikeBook(text) {
  const paragraphs = text.trim().split(/\n\s*\n/);
  return paragraphs
    .map((para, index) => {
      return `<div id="para-${index + 1}">${para.trim()}</div>`;
    })
    .join("");
}

const increaseFontSize = () => {
  fontSize.value += 2;
};

const decreaseFontSize = () => {
  fontSize.value -= 2;
};

const recordView = async () => {
  if (!viewRecorded.value) {
    try {
      await axios.post(`${import.meta.env.VITE_API}/chapter/${id}/view`);
      viewRecorded.value = true;
      console.log("View recorded");
    } catch {
      console.error("Error recording view");
    }
  }
};
const getLikes = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API}/count/likes/${bookId}/${chapterId}`
    );

    // Extract 'likes' from the response data
    if (data && typeof data.likes === "number") {
      likesCount.value = data.likes;
      console.log("Likes count:", likesCount.value);
    } else {
      console.error("Unexpected response structure:", data);
    }
  } catch (error) {
    console.error("Error getting likes", error);
  }
};

let viewTimeout;

let nextChapter = parseInt(route.params.chapterId) + parseInt(1);
onMounted(() => {
  fetchABook();
  getLikes();

  viewTimeout = setTimeout(() => {
    recordView();
  }, 59000);
});

//Mount all
onUnmounted(() => {
  clearTimeout(viewTimeout);
});
</script>

<template>

  <Head v-if="bookData">
    <title>{{ bookData.title }} | Book-A-Choose</title>
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" :content="bookData.title" />
    <meta property="og:description" :content="bookData.description" />
    <meta property="og:image" :content="bookData.image" />
    <meta property="og:url" :content="URL + '/book/' + bookData.id" />
    <meta name="author" :content="bookData.author" />
  </Head>

  <div class="container mx-auto p-4 text-white mb-6 bg-slate-600/10 backdrop-blur-sm rounded-lg">
    <Back />
    <Separator />
    <div class="space-y-3 mb-6">
      <!-- Tools toolbar -->
      <div v-if="user && bookData" class="p-2 inline-flex items-center backdrop-blur-sm bg-slate-950 rounded space-x-5">
        <div v-if="bookData.chapter_editor === user.name" class="space-x-4">
          <Btn variant="primary" :href="`/book/${bookData.book_id}/chapter/${id}/edit`">
            Edit chapter
          </Btn>
        </div>
        <!-- LIKE SYSTEM -->
        <div v-if="user">
          <LikeBtn :userId="user.id" :bookId :chapterId />
        </div>
        <div><i class="fa fa-heart"></i> {{ likesCount }} likes</div>
        <div>
          <ViewIcon /> {{ bookData.views }}
        </div>
        <div>
          <span>Font Size:</span>
          <button type="button" @click="decreaseFontSize" class="bg-transparent px-2 py-1 rounded">
            <i class="fa-solid fa-circle-minus"></i>
          </button>
          <span>{{ fontSize }}px</span>
          <button type="button" @click="increaseFontSize" class="bg-transparent px-2 py-1 rounded">
            <i class="fa-solid fa-circle-plus"></i>
          </button>
        </div>
        <!-- LIKE SYSTEM -->
      </div>
      <!-- Tools toolbar -->
    </div>
    <div v-if="bookData">
      <h2 class="text-3xl font-semibold mb-4">{{ bookData.title }}</h2> <a class="text-xl"
        :href="`/book/${bookId}/chapter/${nextChapter}`" :text="'Next Chapter'" />
    </div>
    <hr class="border-gray-700/20 my-4" />

    <div v-if="chapterData" v-html="chapterData" :style="{ fontSize: fontSize + 'px' }" class="text-zinc-300 leading-relaxed first-line:uppercase first-line:tracking-widest
       first-letter:text-slate-900 first-letter:text-7xl first-letter:leading-none 
       first-letter:float-left first-letter:font-bold first-letter:mr-3 dark:first-letter:text-white
       text-justify
       ">
    </div>

    <div class="mt-6 py-6 flex justify-center">
      <Separator />
      <a class="text-xl" :href="`/book/${bookId}/chapter/${nextChapter}`" :text="'Next Chapter'" />
      <div class="text-2xl ml-6 text-white"></div>
    </div>
    <Comments :bookId="bookId" :chapterId="chapterId" />
  </div>
</template>
