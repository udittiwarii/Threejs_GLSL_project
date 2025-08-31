precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float uTimeline;
uniform int uStartindex;
uniform int uEndindex;
uniform sampler2D uImage1; 
uniform sampler2D uImage2; 
uniform sampler2D uImage3; 
uniform sampler2D uImage4; 


#define NUM_OCTAVES 5

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

vec4 sampleColor(int index , vec2 uv){
    if(index == 0){
        return texture2D(uImage1, uv);
    }
    else if(index == 1){
        return texture2D(uImage2, uv);
    }
    else if(index == 2){
        return texture2D(uImage3, uv);
    }
    else if(index == 3){
        return texture2D(uImage4, uv);
    }
    return vec4(1.0, 0.0, 0.0, 1.0); // fallback = red (debug)
}


void main() {
	  vec2 uv = vUv;    

	float wave = fbm(3.5 * uv + uTime/20.0);
	float strength = smoothstep(.0 , 1.0 , uTimeline) - smoothstep(2.0 , 3.0 , uTimeline);
	float distort = mix(1.0 , 1.2+strength , wave) ;
	uv -= 0.5;
	uv *= distort;
	uv += 0.5;


	if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 ){
    discard;
	}

vec4 Starttexture = sampleColor(uStartindex , uv);
vec4 Endtexture   = sampleColor(uEndindex , uv);

float Changetimeline = smoothstep(.5 , 2.0 , uTimeline);
float mixture = 1.0 - step(Changetimeline , wave);

vec4 color = mix(Starttexture , Endtexture , mixture);
gl_FragColor = color;

}
