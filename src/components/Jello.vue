<template>
    <div ref="jello" class="jello"></div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'

    export default {

        name: 'Jello',

        props: {
            // src de l'image de fond
            bgImg: String,
            // options
            options: Object,
            // src de l'images servant à faire la distortion
            distortImg: String
        },

        data() {
            return { 
                imgRef: null,
                resizeTimeout: null
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

        computed: {
            canvasHolder() {
                return this.$refs.jello
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
                const appHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                // céer l'application PIXI
                this.app = new PIXI.Application(this.appWidth, appHeight, {transparent: true})
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
                    this.distortionLevel(0)               
                }

                // lorsque la souris est en dehors
                this.imgBg.mouseout = () => {
                    this.distortionLevel(1)
                }

                // placer l'image de fond dans l'application
                this.app.stage.addChild(this.imgBg)
           
            },

            createFilter() {
                // créer le sprite de l'image de reference de la distortion
                this.displacementSprite = PIXI.Sprite.fromImage(this.distortRef.name)
                // créer le filter
                this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite)
                // placer l'image e reference sur la scéne
                this.app.stage.addChild(this.displacementSprite)
                // appliquer le filter
                this.imgBg.filters = [
                    this.displacementFilter
                ]
            },

            resizeImages() {
                
                // place les images à 100% du containeur
                // dans la scene

                // définir le ratio entre l'application et les images à afficher
                const ratioImgBg = (this.appWidth / this.imgRef.data.width) + ( this.options.transition * (this.options.dispScale + 10)) * 0.002 
                const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                this.imgBg.x = this.appWidth / 2
                this.imgBg.y = newHeight / 2

                this.imgBg.scale.x = this.imgBg.scale.y = ratioImgBg   
            },   

            animateFilters() {
                this.app.ticker.add(() => {

                    this.displacementFilter.scale.x = this.options.dispX ? this.options.transition * this.options.dispScale : 0
                    this.displacementFilter.scale.y = this.options.dispY ? this.options.transition * (this.options.dispScale + 10) : 0

                    this.displacementSprite.x = Math.sin(this.options.count * 0.15) * 200
                    this.displacementSprite.y = Math.cos(this.options.count * 0.13) * 200

                    this.displacementSprite.rotation = this.options.count * 0.065

                    // compteur incrémenté à chaque tick
                    this.options.count += 0.05 * this.options.speed

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
         
            distortionLevel(amt) {
                // option transition 0/1
                TweenLite.to(
                    this.options, 1, {
                        transition: amt,
                        speed: this.options.speed,
                        dispScale: this.options.dispScale,
                        ease: Power2.easeInOut
                    }
                )
            }
        }
    }

</script>

<style scoped>
    .jello{
        overflow: hidden;
    }

</style>