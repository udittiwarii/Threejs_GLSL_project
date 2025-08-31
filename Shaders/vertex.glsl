precision mediump float;

varying vec2 vUv;

void main() {
    vUv = uv; // Pass UV coordinates to fragment shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
