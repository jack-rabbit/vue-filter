<template>
    <div id="app">
        <img src="./assets/logo.png" width="50px">
        <HelloWorld/>
        <br><br><br><br>
        <div class="container__filter">
            <a href="#">
                <Jello 
                    :bgImg="refBgImg" 
                    :options="refOptions"
                    :distortImg="refDistortImg"
                    v-if="showJello"
                />
                <TonalNoise 
                    :bgImg="refBgImg" 
                    v-if="showTonalNoise" 
                />
                <Glitch 
                    :bgImg="refBgImg" 
                    v-if="showGlitch" 
                />
            </a>
        </div>
    </div>
</template>

<script>

    import HelloWorld from './components/HelloWorld'
    import Jello from './components/Jello'
    import TonalNoise from './components/TonalNoise'
    import Glitch from './components/Glitch'

    export default {

        name: 'App',

        data () {
	        return {
                showTonalNoise: true,
                showJello: false,
                showGlitch: false,
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
            HelloWorld,
            Jello,
            TonalNoise,
            Glitch
        }
    }

</script>

<style>

    *{
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        margin:0;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    
    .container__filter{
        width:80%;
        margin:0 auto;
    }
</style>
