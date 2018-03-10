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
                <WhiteNoise 
                    :bgImg="refBgImg" 
                    v-if="showWhiteNoise" 
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
    import WhiteNoise from './components/WhiteNoise'
    import Glitch from './components/Glitch'

    export default {

        name: 'App',

        data () {
	        return {
                showWhiteNoise: true,
                showJello: false,
                showGlitch: true,
                refBgImg: 'bg/image-1.jpg',
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
            WhiteNoise,
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
