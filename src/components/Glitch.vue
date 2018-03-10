<template>
    <div ref="glitch" class="glitch"></div>
</template>

<script>

    import * as PIXI from 'pixi.js'
    import TweenLite from 'gsap'
    //import {Glitch} from '../filters/filters'

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
                    this.glitch()
                  /*  this.createStage()
                    this.createFilter()
                    this.resizeImages()
                    this.animateFilters()*/
                })    
            },

            glitch() {
                function GlitchFilter() {
                    var vertexShader = null;
                    var fragmentShader = [
                        'precision mediump float;',
                        'uniform sampler2D uSampler;',
                        'uniform float rand;',
                        'uniform float val1;',
                        'uniform float val2;',
                        'uniform vec4 dimensions;',
                        'varying vec2 vTextureCoord;',
                        'void main (void)',
                        '{',
                        '   vec2 pos = vTextureCoord * vec2(dimensions);',
                        '   vec2 posOffset = pos + vec2(floor(sin(pos.y / val1 * rand + rand * rand)) * val2 * rand, 0);',
                        '   posOffset = posOffset / vec2(dimensions);',
                        '   vec4 col = texture2D(uSampler, posOffset);',
                        '   gl_FragColor.rgba = col.rgba;',
                        '}'
                    ].join('\n');

                    PIXI.Filter.call(
                        this,
                        vertexShader,
                        fragmentShader
                    );
                    
                    this.uniforms.rand = 5
                    this.uniforms.val1 = 150
                    this.uniforms.val2 = 20
                    this.uniforms.dimensions = new Float32Array(2)
                    this.uniforms.timer = 0
                }

                GlitchFilter.prototype = Object.create(PIXI.Filter.prototype);
                GlitchFilter.prototype.constructor = GlitchFilter;

                // définir le ratio de l'image
                this.imgRatio = this.imgRef.data.height / this.imgRef.data.width 
                // définir la largeur du containeur
                this.appWidth = this.canvasHolder.offsetWidth
                // définir proportionnellement la hauteur du containeur
                this.appHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                // Create renderer
                var renderer = PIXI.autoDetectRenderer(this.appWidth, this.appHeight, /*{transparent: true}*/);
                renderer.clearBeforeRender = true;

                //Add the canvas to the HTML document
                this.canvasHolder.append(renderer.view);

                // Create a container object called the `stage`
                var stage = new PIXI.Container();

                // Create sprite
                var sprite = new PIXI.Sprite.fromImage(this.imgRef.name);
                sprite.x = 0;
                sprite.y = 0;
                sprite.width = this.appWidth;
                sprite.height = this.appHeight;
                stage.addChild(sprite);

                var filter = new GlitchFilter();
                //stage.filters = [filter];
                
                // Render
                this.then = Date.now();
                this.glitch = false;
                this.sprite = sprite;
                this.filter = filter;
                this.renderer = renderer;
                this.stage = stage;
                this.PixiRender();
            },
            
            PixiRender() {

                var glitch = this.glitch;
                var renderer = this.renderer;
                var stage = this.stage;
                var filter = this.filter;
                var sprite = this.sprite;

                var now = Date.now();
                var then = this.then;
                var rate = 50;
                var delta = now - then;

                if (delta > rate) {
                    if (Math.random() > 0.9){
                        glitch = !glitch;
                    }
                    then = now - (delta % rate);
                    this.then = then;
                    this.glitch = glitch;
                }

                if (glitch) {
                    if (Math.random() > 0.5) {
                        sprite.width = this.appWidth;

                        filter.rand = Math.random()*3;
                        filter.val1 = Math.random()*200;
                        filter.val2 = Math.random()*20;
                    } else {
                        sprite.width = this.appWidth*(20+Math.random()*20);
                    }
                } else {
                    filter.rand = 0;
                    sprite.width = this.appWidth;
                }
        
                renderer.render(stage);

                // rAF
                requestAnimationFrame(() => {
                    this.PixiRender()
                });
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

                // créer l'interactivité
                this.imgBg.interactive = true

                // au survol
                this.imgBg.mouseover = () => {
                   //this.noiseLevel(0)               
                }

                // lorsque la souris est en dehors
                this.imgBg.mouseout = () => {
                    //this.noiseLevel(1)
                }

                // placer l'image de fond dans l'application
                this.app.stage.addChild(this.imgBg)
           
            },

            createFilter() {

                // créer le filter
                this.glitchFilter = new Glitch()
                // appliquer le filter
                this.app.stage.filters = [this.glitchFilter]
            },

            resizeImages() {
                
                // place les images à 100% du containeur
                // dans la scene

                // définir le ratio entre l'application et les images à afficher
                const ratioImgBg = (this.appWidth / this.imgRef.data.width)
                const newHeight = Number( this.appWidth * this.imgRatio ).toFixed()

                this.imgBg.width = 0
                this.imgBg.height = 0
                this.imgBg.width = this.appWidth
                this.imgBg.height = newHeight
            },

            animateFilters() {
                this.app.ticker.add(() => {

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
    .glitch{
        overflow: hidden;
    }

</style>