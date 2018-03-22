<template>
    <div id="app">
        <Selecter :vueCourante="vueCourante" />
        <router-view name="main" :key="$route.fullPath" /> 
    </div>
</template>

<script>

    import Selecter from './components/Selecter'
    import Jello from './components/Jello'
    import TonalNoise from './components/TonalNoise'
    import Glitch from './components/Glitch'

    export default {

        name: 'App',

        data () {
	        return {
                vueCourante: 'accueil',
                showTonalNoise: false,
                showJello: false,
                showGlitch: true,
                refBgImg: 'bg/reference_test_frag_shader.jpg',
                refOptions: {
                    transition: 1,
                    speed: 2.5,
                    dispScale: 5,
                    dispX: true,
                    dispY: true,
                    count: 0
                },
                refDistortImg: 'distortion/dmap-clouds-01.jpg'
	        }
	    },
        components: {
            Selecter,
            Jello,
            TonalNoise,
            Glitch
        }
    }

</script>

<style>

    @import './assets/css/bootstrap.css';
        
    #app {
        font-family: Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        overflow: hidden;
    }
    
</style>
