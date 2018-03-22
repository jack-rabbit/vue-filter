<template>
    <div class="accueil">        
        <div class="accueil_content">
            <div>
                <img src="../assets/logo.png" width="50px">
                <h2 class="display-6">vue.js components</h2>
                <p class="lead">Expérimentation de filters webgsl avec Pixi.js v4</p>
            </div>
        </div>
        <div class="full"></div>        
    </div>
</template>

<script>
export default {
  name: 'Accueil',
}
</script>


<style >

    .accueil{
        height: 100vh;
        width: 100vw;   
        overflow: hidden;  
        position: relative;
    }
    .accueil_content{
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }
    .full{
        background: #f1f1f1;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        top:0;
    }
    
</style>
