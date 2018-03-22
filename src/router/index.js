import Vue from 'vue'
import Router from 'vue-router'
import filterSelecter from '../components/filterSelecter'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'accueil',
            components: {
                main: resolve => require(['../components/Accueil.vue'], resolve)
            }
        },
        {
            path: '/filter/Glitch',
            name: 'Glitch',
            components: {
                main: resolve => require(['../components/Glitch.vue'], resolve)
            }
        },
        {
            path: '/filter/Jello',
            name: 'Jello',
            components: {
                main: resolve => require(['../components/Jello.vue'], resolve)
            }
        },
        {
            path: '/filter/TonalNoise',
            name: 'TonalNoise',
            components: {
                main: resolve => require(['../components/TonalNoise.vue'], resolve)
            }
        },
        {
            path: '/filter/Distort',
            name: 'Distort',
            components: {
                main: resolve => require(['../components/Distort.vue'], resolve)
            }
        }
        /*
        {
            path: '/filter/:filter',
            name: 'filter',
            components: 'filterSelecter',
            props: (route) => ({ filter: route.params.filter })
        }*/
    ]
})

export default router