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
                    this.testShader()
                  /*  this.createStage()
                    this.createFilter()
                    this.resizeImages()
                    this.animateFilters()*/
                })    
            },

            testShader() {
                    var app = new PIXI.Application(600, 400, {backgroundColor : 0x1099bb});
                    document.body.appendChild(app.view);

                    // create filter
                    // 
                    var fragSrcRemoveRed = `
                        precision mediump float;                        
                        varying vec2 vTextureCoord;
                        uniform sampler2D uSampler;
                        
                        void main(void)
                        {
                            vec4 pixel = texture2D(uSampler, vTextureCoord);
                            pixel.r = 0.0;
                            gl_FragColor = pixel;
                        }
                    `.split('\n').reduce( (c, a) => c + a.trim() + '\n' )

                    const fragmentShaderX = `
                        precision mediump float;                        
                        varying vec2 vTextureCoord; 
                        uniform sampler2D uSampler;                       
                        uniform vec2 dimensions;
                        uniform vec4 filterArea;

                        vec2 mapCoord( vec2 coord )
                        {
                            coord *= filterArea.xy;

                            return coord;
                        }

                        vec2 unmapCoord( vec2 coord )
                        {
                            coord /= filterArea.xy;

                            return coord;
                        }

                        vec2 offset(vec2 pos)
                        {
                            if (pos.x < 0.0 || pos.y < 0.0 || pos.x > 1.0 || pos.y > 1.0) {
                                return vec2(0.0);
                            } else {
                                return pos;
                            }
                        }
                        
                        void main(void)
                        {
                            vec2 coord = vTextureCoord;
                            coord = mapCoord(coord ) / dimensions;
                            coord = offset ( coord );
                            coord = unmapCoord(coord * dimensions);
                            gl_FragColor = texture2D( uSampler, coord );
                        }
                    `.split('\n').reduce( (c, a) => c + a.trim() + '\n' )

                    var fragSrcY = `
                        precision mediump float;
                        varying vec2 vTextureCoord;
                        uniform sampler2D uSampler;
                        uniform vec2 dimensions;
                        uniform vec4 filterArea;

                        vec2 mapCoord( vec2 coord )
                        {
                            coord *= filterArea.xy;

                            return coord;
                        }

                        vec2 unmapCoord( vec2 coord )
                        {
                            coord /= filterArea.xy;

                            return coord;
                        }

                        vec2 warpAmount = vec2( 2.0 / 34.0, 1.0 / 16.0 );

                        vec2 warp(vec2 pos)
                        {
                            pos = pos * 2.0 - 1.0;
                            pos *= vec2(
                            1.0 + (pos.y * pos.y) * warpAmount.x,
                            1.0 + (pos.x * pos.x) * warpAmount.y
                            );
                            return pos * 0.5 + 0.5;;
                        }
                        
                        void main() {
                            vec2 coord = vTextureCoord;
                            coord = mapCoord(coord ) / dimensions;
                            coord = warp( coord );
                            #coord = unmapCoord(coord * dimensions);
                            gl_FragColor = texture2D( uSampler, coord );
                        }
                    `.split('\n').reduce( (c, a) => c + a.trim() + '\n' );

                    var filter = new PIXI.Filter( null, fragmentShaderX );
                    filter.apply = function(filterManager, input, output)
                    {
                        this.uniforms.dimensions[0] = input.sourceFrame.width
                        this.uniforms.dimensions[1] = input.sourceFrame.height

                        // draw the filter...
                        filterManager.applyFilter(this, input, output);
                    }

                    // load image

                    var texture = PIXI.Texture.from( this.imgSrc );
                    var sprite = new PIXI.Sprite( texture );
                    app.stage.addChild( sprite );
                    sprite.x = 50;
                    sprite.y = 50;
                    sprite.scale.x = sprite.scale.y = 0.25

                    // apply filter
                    sprite.filters = [ filter ];
            },
            
            PixiRender() {

                this.renderer.render(this.container);

                // rAF
                requestAnimationFrame((delta) => {
                    this.filter.uniforms.time += 0.01
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