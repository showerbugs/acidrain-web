import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Sentence from '../components/Sentence'
import Game from '../components/Game'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/sentence', component: Sentence, name: 'sentence', props: true },
    { path: '/game', component: Game, name: 'game' }
  ]
});

export default router
