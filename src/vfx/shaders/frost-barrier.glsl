// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



float hash(float n, float seed) {
    return fract(sin(n) * seed);
}

vec2 smoothstep(vec2 f){
    return f * f * (3.0 - 2.0 * f);
}

float smoothstep(float f){
    return f * f * (3.0 - 2.0 * f);
}

float value_noise(vec2 p, float seed, float yshift, float yscale) {
    vec2 i = floor(p);
    i.y += yshift;
    vec2 f = fract(p);
    f = smoothstep(f);
    //float yscale = 3505.0;
    float n = i.x +i.y * yscale;
    return mix(mix(hash(n,seed), hash(n + 1.0,seed), f.x), mix(hash(n + yscale,seed), hash(n + yscale+1.0,seed), f.x), f.y);
}


void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    float seed = 10.5453;
    //st = mod(st*4.0,1.0);
    st += value_noise(st*24.5,seed,0.0,57.0)*0.1;
    st += value_noise(st*4.5+u_time*0.1,u_time*0.1,0.0,57.0);
    //st*=st;
    //st = smoothstep(st);
    //st = mod(st*9.0,1.0);
    //st.x = fract(cos(st.x)* 43758.5453);
    //st.y = fract(cos(st.y)* 33796.5453);
	float n = value_noise(-st*3.0+ mod(u_time,71.0)*0.5,seed,5057.0,3505.0);
    //n = smoothstep(n);
    vec3 color = vec3(0.4,0.8,1)*n;
    //color = vec3(st.x,abs(floor(u_time*st.y))/st.y,0);

    gl_FragColor = vec4(color,1.000);
}