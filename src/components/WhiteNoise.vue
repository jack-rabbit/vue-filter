<template>
    <div ref="whiteNoise" class="whiteNoise"></div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'
    import {WhiteNoiseFilter} from '../filters/filters'

    export default {

        name: 'Noise',

        props: {
            // src de l'image de fond
            bgImg: String
        },

        data() {
            return { 
                imgRef: null,
                resizeTimeout: null
            }
        },

        created() {
            this.imgSrc = require('../assets/images/' + this.bgImg)
            this.loadImage()
        }, 

        mounted() {
            this.addListeners()
        },

        computed: {
            canvasHolder() {
                return this.$refs.whiteNoise
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
                this.appHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                // céer l'application PIXI
                this.app = new PIXI.Application(this.appWidth, this.appHeight, /*{transparent: true}*/)
                this.app.clearBeforeRender = true

                // placer l'application dans le containeur
                this.canvasHolder.appendChild(this.app.view)

                // créer l'image de fond
                this.imgBg = PIXI.Sprite.fromImage(this.imgRef.name)
                this.imgBg.anchor.set(0.5)

                // créer l'interactivité
                this.imgBg.interactive = true

                // au survol
                this.imgBg.mouseover = () => {
                   this.noiseLevel(0)               
                }

                // lorsque la souris est en dehors
                this.imgBg.mouseout = () => {
                    this.noiseLevel(1)
                }

                // placer l'image de fond dans l'application
                this.app.stage.addChild(this.imgBg)
           
            },

            createFilter() {
                // Creer le containeur du filtre
                this.bgBackgroundNoise = new PIXI.Graphics()
                this.bgBackgroundNoise.beginFill(0x000000,0)
                this.bgBackgroundNoise.drawRect(0, 0, this.appWidth, this.appHeight)
                this.bgBackgroundNoise.endFill()
                this.app.stage.addChild(this.bgBackgroundNoise)
                // créer le filter
                this.noiseFilter = new WhiteNoiseFilter()
                // appliquer le filter
                this.bgBackgroundNoise.filters = [this.noiseFilter]
            },

            resizeImages() {
                
                // place les images à 100% du containeur
                // dans la scene

                // définir le ratio entre l'application et les images à afficher
                const ratioImgBg = (this.appWidth / this.imgRef.data.width)
                const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                this.imgBg.x = this.appWidth / 2
                this.imgBg.y = newHeight / 2

                this.bgBackgroundNoise.width = this.appWidth
                this.bgBackgroundNoise.height = newHeight

                this.imgBg.scale.x = this.imgBg.scale.y = ratioImgBg   
            },

            animateFilters() {
                this.app.ticker.add(() => {
                    this.noiseFilter.uniforms.multiplier = Math.random()
                })
            },

            resizeStage() {

                // définir la nouvelle largeur du containeur
                this.appWidth = this.canvasHolder.offsetWidth
                const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                // retailler l'app
                this.app.renderer.resize(this.appWidth , newHeight)

                //postionner l'image de fond 
                this.resizeImages()
            },

            noiseLevel(amt) {
                // option transition 0/1
                TweenLite.to(
                    this.noiseFilter.uniforms, 1, {
                        alpha: amt,
                        ease: Power2.easeInOut
                    }
                )
            }

        }
    }

</script>

<style scoped>
    .whiteNoise{
        overflow: hidden;
    }

</style>