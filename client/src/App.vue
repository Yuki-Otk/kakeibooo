<template>
  <div class="root">
    <KakeiboooAppBar/>
    <!-- いまはappbarの中で画面下半分を描画しているが、本当はrouterとか使ってここでやるべき -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import KakeiboooAppBar from '@/components/appbar/KakeiboooAppBar.vue';

export default defineComponent({
  components: {
    KakeiboooAppBar,
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap');

.root {
  font-family: 'M PLUS Rounded 1c', sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  background: #FFFFFF;
}
</style>