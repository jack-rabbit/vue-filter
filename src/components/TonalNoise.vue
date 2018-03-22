<template>
    <div ref="tonalNoise" class="tonalNoise"></div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'
    import {TonalNoiseFilter} from '../filters/tonalNoise-filter'

    export default {

        name: 'TonalNoise',

        props: {
            // src de l'image de fond
            useIng: {
                default: true,
                type: Boolean
            },
            bgImg: {
                default: 'bg/forest.jpg',
                type: String
            }
        },

        data() {
            return { 
                imgRef: null,
                noiseValue: 0.25,
                resizeTimeout: null,
                interactivFilter: false                
            }
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
                return this.$refs.tonalNoise
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
                this.app = new PIXI.Application(this.appWidth, this.appHeight, {transparent: true})
                this.app.clearBeforeRender = true

                // placer l'application dans le containeur
                this.canvasHolder.appendChild(this.app.view)

                // Create background
                this.bgBackground = new PIXI.Graphics()
                this.bgBackground.beginFill(0x000000, 1)
                this.bgBackground.drawRect(0, 0, this.appWidth, this.appHeight)
                this.bgBackground.endFill()

                // créer l'image de fond
                this.imgBg = PIXI.Sprite.fromImage(this.imgRef.name)
                this.imgBg.anchor.set(0.5)

                // créer l'interactivité
                if(this.interactivFilter){
                    this.imgBg.interactive = true
                }

                // au survol
                this.imgBg.mouseover = () => {
                   this.noiseLeveling(0)               
                }

                // lorsque la souris est en dehors
                this.imgBg.mouseout = () => {
                    this.noiseLeveling(this.noiseValue)
                }           
            },

            createFilter() {
                // Creer le containeur du filtre
                // créer le filter
                this.noiseFilter = new TonalNoiseFilter()
                this.noiseFilter.uniforms.uNoise = this.noiseValue

                // appliquer le filter
                if(this.useIng){
                    // placer l'image de fond dans l'application
                    this.app.stage.addChild(this.imgBg)
                    this.imgBg.filters = [this.noiseFilter]                    
                }else{
                    this.app.stage.addChild(this.bgBackground)
                    this.bgBackground.filters = [this.noiseFilter]
                }
            },

            resizeImages() {
                
                // Place l'image pour 'couvrir'
                // tout le conteneur

                const ratioImgBg = (this.imgRef.data.width / this.imgRef.data.height)  
                const ratioApp = (this.appWidth / this.appHeight)

                console.log('resize TonalNoise')
                /*
                console.log('image')
                console.log(this.imgRef.data.width, this.imgRef.data.height)
                console.log('ratio image',ratioImgBg)

                console.log('appli')
                console.log(this.appWidth, this.appHeight)
                console.log('ratio appli',ratioApp)
                */

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

            },

            animateFilters() {
                this.app.ticker.add(() => {
                    this.noiseFilter.uniforms.uSeed = Math.random()
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

            },

            noiseLeveling(value) {
                // option transition 0/1
                TweenLite.to(
                    this.noiseFilter.uniforms, 1, {
                        uNoise: value,
                        ease: Power2.easeInOut
                    }
                )
            }

        }
    }

</script>

<style>

    .tonalNoise{
        height: 100vh;
        width: 100vw;   
        overflow: hidden;  
        position: relative;
        filter: grayscale(100%);
        opacity:1;
    }

</style>