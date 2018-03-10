/* Pixi JS Noise filter
   -------------------------------------------------------------------------- */
export function WhiteNoiseFilter () {
    const vertexShader = null
    const fragmentShader = `
        precision highp float;
        
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        
        uniform float multiplier;
        uniform sampler2D uSampler;                
        uniform float alpha;

        float rand(vec2 co)
        {
            return fract(sin(dot(co.xy, vec2(30000, 60))) * (5000.0+(10000.0*multiplier)));
        }
        
        void main()
        {
            vec4 color = texture2D(uSampler, vTextureCoord);
        
            float diff = (rand(vTextureCoord) - 0.65 ) ;
        
            color.r += diff;
            color.g += diff;
            color.b += diff;
        
            gl_FragColor = color * alpha;
        }
    `
    PIXI.Filter.call(
        this,
        vertexShader,
        fragmentShader
    )

    this.uniforms.multiplier = 0.5
    this.uniforms.alpha = 1

}

WhiteNoiseFilter.prototype = Object.create(PIXI.Filter.prototype)
WhiteNoiseFilter.prototype.constructor = WhiteNoiseFilter




/* Pixi JS Glitch shader
   -------------------------------------------------------------------------- */
export function Glitch() {
    const vertexShader = null
    const fragmentShader = `
        precision mediump float;
        uniform sampler2D uSampler;
        uniform float rand;
        uniform float val1;
        uniform float val2;
        uniform vec4 dimensions;
        varying vec2 vTextureCoord;
        void main (void)
        {
           vec2 pos = vTextureCoord * vec2(dimensions);
           vec2 posOffset = pos + vec2(floor(sin(pos.y / val1 * rand + rand * rand)) * val2 * rand, 0);
           posOffset = posOffset / vec2(dimensions);
           vec4 col = texture2D(uSampler, posOffset);
           gl_FragColor.rgba = col.rgba;
        }

    `
    PIXI.Filter.call(
        this,
        vertexShader,
        fragmentShader
    )

    this.uniforms.rand = 5
    this.uniforms.val1 = 150
    this.uniforms.val2 = 20
    this.uniforms.dimensions = [0, 0, 0, 0]
    this.uniforms.timer = 0

}

Glitch.prototype = Object.create(PIXI.Filter.prototype)
Glitch.prototype.constructor = Glitch

