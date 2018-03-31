<template>
    <div id="app">
        <Selecter :vueCourante="vueCourante" />
        <router-view name="main" :key="$route.fullPath" /> 
    </div>
</template>

<script>
    import Selecter from './components/Selecter'
    export default {

        name: 'App',

        data () {
	        return {
                vueCourante: 'accueil'
	        }
        },
        
        components: {
			Selecter
		},
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
