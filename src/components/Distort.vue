<template>
    <div ref="distort" class="distort"></div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'
    import { DistortFilter } from '../filters/distort-filter'

    export default {

        name: 'Distort',

        data() {
            return { 
                imgRef: null,
                resizeTimeout: null,
                bgImg: 'bg/fleurs.jpg',
                distortImg: 'distortion/noise.png',
                distortValue: 10,
            }
        },
        
        created() {
            this.imgSrc = require('../assets/images/' + this.bgImg)
            this.distortSrc = require('../assets/images/' + this.distortImg)
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
                return this.$refs.distort
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
                this.loader.add( 'distortRef', this.distortSrc )
                this.loader.load( (loader, resources) => {
                    this.imgRef = resources.imgRef
                    this.distortRef = resources.distortRef
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

                // créer la texture
                this.texture = PIXI.Texture.fromImage(this.imgRef.name)
                this.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
                this.texture.baseTexture.mipmap = false

                // créer l'image de fond
                this.imgBg = new PIXI.Sprite(this.texture)
                this.imgBg.anchor.set(0.5)

                // créer l'interactivité
                this.imgBg.interactive = true

                // au survol
                this.imgBg.mouseover = () => {
                    this.distortionLevel(100)               
                }

                // lorsque la souris est en dehors
                this.imgBg.mouseout = () => {
                    this.distortionLevel(this.distortValue)
                }

                // placer l'image de fond dans l'application
                this.app.stage.addChild(this.imgBg)
           
            },

            createFilter() {
                // Creer le containeur du filtre
                // créer le filter

                this.distortFilter = new DistortFilter()
                this.distortFilter.uniforms.noiseTexture = PIXI.Texture.fromImage(this.distortRef.name)
                this.distortFilter.uniforms.amplitude = this.distortValue

                this.distortFilter.apply = function(filterManager, input, output, refImg){

                    this.uniforms.res[0] = input.sourceFrame.width
                    this.uniforms.res[1] = input.sourceFrame.height

                    // draw the filter...
                    filterManager.applyFilter(this, input, output);
                }
                this.imgBg.filters = [this.distortFilter]
            },

            resizeImages() {
                
                // centre l'image dans l'application PIXI
                this.imgBg.x = this.appWidth / 2
                this.imgBg.y = this.appHeight / 2
                this.imgBg.scale.set(.5, .5)

                console.log('resize Distort')
            },   

            animateFilters() {
                this.app.ticker.add(() => {
                    this.distortFilter.uniforms.time += 0.01
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
         
            distortionLevel(value) {
                TweenLite.to(
                    this.distortFilter.uniforms, 1, {
                        amplitude: value,
                        ease: Power2.easeInOut
                    }
                )
            }
        }
    }

</script>

<style scoped>
    .distort{
        height: 100vh;
        width: 100vw;   
        overflow: hidden;  
        position: relative;
        opacity:1;
    }

</style>