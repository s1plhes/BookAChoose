<!-- eslint-disable vue/multi-word-component-names -->
<script>
import algoliasearch from "algoliasearch/lite";
import "instantsearch.css/themes/algolia-min.css";
import { getPropertyByPath } from "instantsearch.js/es/lib/utils";

export default {
  data() {
    return {
      searchClient: algoliasearch("Q4L8PI0OOJ", "5df9310a21f87d5849f4853f4e76c692"),
    };
  },
  methods: {
    getPropertyByPath,
  },
};
</script>

<template>
  <ais-instant-search :search-client="searchClient" index-name="books">
    <ais-configure :hits-per-page.camel="5"></ais-configure>
    <ais-search-box></ais-search-box>
    <ais-hits>
      <template v-slot:item="{ item }">
        <img :src="item.password" />
        <div class="hit-id">
          <ais-highlight attribute="id" :hit="item"></ais-highlight>
        </div>
        <div class="hit-name">
          <ais-highlight attribute="name" :hit="item"></ais-highlight>
        </div>
        <div class="hit-email">
          <ais-highlight attribute="email" :hit="item"></ais-highlight>
        </div>
      </template>
    </ais-hits>
  </ais-instant-search>
</template>

<style></style>
