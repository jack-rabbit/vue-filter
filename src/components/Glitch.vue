<template>
    <div>
        <div class="blend">
            <TonalNoise :useIng="true" :bgImg="'bg/pirate.jpg'"/>
        </div>
        <div ref="glitch" class="glitch"></div>
    </div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'
    import TonalNoise from './TonalNoise'
    import {Glitch} from '../filters/glitch-filter'

    export default {

        name: 'Glitch',

        data() {
            return { 
                bgImg: 'bg/pirate.jpg',
                imgRef: null,
                resizeTimeout: null,
                then: Date.now(),
                cover: true
            }
        },

        components: {
            TonalNoise
        },

        created() {
            this.imgSrc = require('../assets/images/' + this.bgImg)
            this.loadImage()
        }, 

        mounted() {
            this.addListeners()
        },

        beforeDestroy() {
            this.app.destroy(true)
        },

        computed: {
            canvasHolder() {
                return this.$refs.glitch
            }
        },

		methods: {
            
            addListeners() {
                window.addEventListener('resize', this.resizeThrottler, false)       
            },

            resizeThrottler() {
                // ignore resize events as long as an actualResizeHandler execution is in the queue
                if ( !this.resizeTimeout ) {
                    this.resizeTimeout = setTimeout(() => {
                        this.resizeTimeout = null
                        this.actualResizeHandler()
                    
                    // The actualResizeHandler will execute at a rate of 15fps
                    }, 66)
                }
            },

            actualResizeHandler() {
                this.resizeStage()
            },

            loadImage() {
                this.loader = new PIXI.loaders.Loader()
                this.loader.add( 'imgRef', this.imgSrc )
                this.loader.load( (loader, resources) => {
                    this.imgRef = resources.imgRef
                    this.createStage()
                    this.createFilter()
                    this.resizeImages()
                    this.animateFilters()
                })    
            },

            createStage() {
                             
                // définir le ratio de l'image
                this.imgRatio = this.imgRef.data.height / this.imgRef.data.width 
                // définir la largeur du containeur
                this.appWidth = this.canvasHolder.offsetWidth
                // définir proportionnellement la hauteur du containeur
                //this.appHeight = Number( this.appWidth * this.imgRatio ).toFixed()
                this.appHeight = this.canvasHolder.offsetHeight

                // céer l'application PIXI
                this.app = new PIXI.Application(this.appWidth, this.appHeight, /*{transparent: true}*/)
                this.app.clearBeforeRender = true

                // placer l'application dans le containeur
                this.canvasHolder.appendChild(this.app.view)

                // créer l'image de fond
                this.imgBg = PIXI.Sprite.fromImage(this.imgRef.name)
                this.imgBg.anchor.set(0.5)

                // placer l'image de fond dans l'application
                this.app.stage.addChild(this.imgBg)
           
            },

            createFilter() {
                // Creer le containeur du filtre
                // créer le filter
                this.glitchFilter = new Glitch()
                this.glitchFilter.apply = function(filterManager, input, output){

                    
                    this.uniforms.dimensions[0] = input.sourceFrame.width
                    this.uniforms.dimensions[1] = input.sourceFrame.height

                    // draw the filter...
                    filterManager.applyFilter(this, input, output);
                }

                // appliquer le filter
                this.imgBg.filters = [this.glitchFilter]
            },

            resizeImages() {
                
                // Place l'image pour 'couvrir'
                // tout le conteneur
                if (this.cover){

                    const ratioImgBg = (this.imgRef.data.width / this.imgRef.data.height)  
                    const ratioApp = (this.appWidth / this.appHeight)

                    /*
                    console.log('image')
                    console.log(this.imgRef.data.width, this.imgRef.data.height)
                    console.log('ratio image',ratioImgBg)

                    console.log('appli')
                    console.log(this.appWidth, this.appHeight)
                    console.log('ratio appli',ratioApp)
                    */

                    console.log('resize Glitch')
                    
                    if( ratioApp >= ratioImgBg ){
                        this.imgBg.width = this.appWidth
                        const newRatio = this.appWidth / this.imgRef.data.width
                        this.imgBg.scale.y = newRatio
                    }else{
                        this.imgBg.height = this.appHeight
                        const newRatio = this.appHeight / this.imgRef.data.height
                        this.imgBg.scale.x = newRatio     
                    }
                    console.log(this.imgBg.width , 'x',this.imgBg.height)   
                    this.imgBg.x = this.appWidth / 2
                    this.imgBg.y = this.appHeight / 2

                // SINON
                // place l'image à 100% de la largeur du conteneur     
                } else {
                    
                    // définir le ratio entre l'application et les images à afficher
                    const ratioImgBg = (this.appWidth / this.imgRef.data.width)
                    const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                    this.imgBg.x = this.appWidth / 2
                    this.imgBg.y = newHeight / 2

                    this.imgBg.scale.x = this.imgBg.scale.y = ratioImgBg  
               }
 
            },

            animateFilters() {
                this.app.ticker.add(() => {
                    const now = Date.now()
                    const rate = 50
                    const delta = now - this.then
                    if (delta > rate) {
                        if (Math.random() > 0.9){
                            this.glitch = !this.glitch
                        }
                        this.then = now - (delta % rate)
                    }
                    if (this.glitch) { 
                        if (Math.random() > 0.5) {
                            this.resizeImages()
                            this.glitchFilter.uniforms.rand = Math.random()*30000
                            this.glitchFilter.uniforms.val1 = Math.random()*2000
                            this.glitchFilter.uniforms.val2 = Math.random()*200
                        } else {
                            this.imgBg.x = this.imgBg.x + ( 20 - Math.random()*40 )
                        }
                    } else {
                        this.glitchFilter.uniforms.rand = 0
                        this.resizeImages()
                    }
                })
            },

            resizeStage() {

                // définir la nouvelle largeur du containeur
                this.appWidth = this.canvasHolder.offsetWidth
                this.appHeight = this.canvasHolder.offsetHeight
                //const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                // retailler l'app
                this.app.renderer.resize(this.appWidth , this.appHeight)

                //postionner l'image de fond 
                this.resizeImages()
            }
        }
    }

</script>

<style scoped>
    .blend{
        mix-blend-mode: screen;
        height: 100vh;
        width: 100vw;   
        overflow: hidden;  
        position: absolute;
        z-index: 5;
        opacity: 0.5;
        filter: grayscale(100%);
    }
    .glitch{
        height: 100vh;
        width: 100vw;   
        overflow: hidden;  
        position: relative;
        filter: grayscale(100%);
        opacity:1;
    }

</style>