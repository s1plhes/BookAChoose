<script setup>
4
const features = [
  {
    title: 'Sign Up or Log In',
    description: 'Create an account or log in to access all features.'
  },
  {
    title: 'Create a Story',
    description: 'Provide a title and start writing your first chapter.'
  },
  {
    title: 'Divide into Chapters',
    description: 'Organize your content into individual chapters.'
  },
  {
    title: 'Publish and Share',
    description: 'Make your story available for others to read.'
  },
  {
    title: 'Explore and Read',
    description: 'Find stories that interest you and enjoy the content.'
  },
  {
    title: 'Interactive Features',
    description: 'Engage with stories through commenting, liking, and sharing.'
  }
]
</script>

<template>
  <article class="text-white max-w-6xl p-6 bg-glass">
    <h1 class="text-3xl font-bold text-yellow-500">About</h1>
    <br />
    <p class="text-lg">
      Book-a-choose is an engaging platform that allows users to create and share their own stories,
      divided into chapters. It provides a simple and intuitive way to write, edit, and publish your
      stories, making it easy for readers to explore and enjoy a wide variety of content. With
      features like personalized user profiles, responsive design, and interactive elements,
      Book-a-choose offers a seamless reading and writing experience. Whether you're an aspiring
      author or an enthusiastic reader, this platform is designed to connect you with a vibrant
      community of storytellers.
    </p>
    <ul>
      <li v-for="feature in features" :key="feature.title">
        <h2 class="text-2xl mt-6 font-semibold text-yellow-500">{{ feature.title }}</h2>
        <p class="mt-2">{{ feature.description }}</p>
      </li>
    </ul>
    <p>
      Book-a-choose combines ease of use with a rich set of features, making it a great place for
      both writing and reading immersive stories.
    </p>
    <br />
  </article>
</template>
