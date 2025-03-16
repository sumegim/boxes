export function setupCustomShaders() {
    BABYLON.Effect.ShadersStore["customVertexShader"] = `   
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }`;

    BABYLON.Effect.ShadersStore["customFragmentShader"] = `
        precision highp float;
        varying vec2 vUV;
        uniform vec2 screenSize;
        uniform sampler2D textureSampler;
        uniform highp sampler2D depth;
        void main(void) {
            vec2 coords = gl_FragCoord.xy / screenSize;
            float distanceToCenter = length(vUV - vec2(0.5,0.5));
            float d = texture2D(depth, coords).x;
            float z = gl_FragCoord.z;
            float a = z > d ? 0.3 : 1.0;
            a = distanceToCenter < 0.5 ? a : 0.0;
            float plop = distanceToCenter < 0.45 ? 1.0 : .8;
            gl_FragColor = vec4(texture2D(textureSampler, vUV).xyz * plop, a);
        }`;
}