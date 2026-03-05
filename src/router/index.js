import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import GuideView from '@/views/GuideView.vue';
import GameBoardView from '@/views/GameBoardView.vue';
import SavedGamesView from '../views/SavedGamesView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/guide',
    name: 'Guide',
    component: GuideView
  },
  {
    path: '/game',
    name: 'Game',
    component: GameBoardView
  },
  {
    path: '/saved-games',
    name: 'SavedGames',
    component: SavedGamesView
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
