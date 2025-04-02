<template>
  <div class="absolute top-0 left-0 z-[1000]">
    <img
      id="inputImage"
      class="hidden w-[512px] h-[512px]"
      src="/src/assets/textures/Rock051_1K-JPG_Color.jpg"
    />
    <img
      id="noiseImage"
      class="hidden w-[512px] h-[512px]"
      src="/src/assets/textures/noise_512x512.png"
    />
  </div>
  <canvas
    id="draw"
    width="512"
    height="512"
    class="z-[1000] w-[512px] h-[512px]"
  ></canvas>
  <canvas
    id="shader"
    width="512"
    height="512"
  ></canvas>
  <button
    class="z-[1002] absolute top-0 right-0 bg-blue-500 text-white p-2"
    @click="saveImage"
  >
    Save Image
  </button>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

interface ShaderUniforms {
  iResolution: [number, number, number]
  iTime?: number
  iChannel0: WebGLTexture | null
  iChannel1: WebGLTexture | null
}

async function processImageWithShader(
  inputImage: HTMLImageElement,
  noiseImage: HTMLImageElement,
  shaderSource: string,
  canvas: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const gl = canvas.getContext('webgl2')

    if (!gl) {
      reject(new Error('WebGL not supported'))
      return
    }

    const width = canvas.clientWidth
    const height = canvas.clientHeight

    canvas.width = width
    canvas.height = height

    const inputTexture = gl.createTexture()
    const noiseTexture = gl.createTexture()

    if (!inputTexture || !noiseTexture) {
      reject(new Error('Failed to create input texture'))
      return
    }

    gl.bindTexture(gl.TEXTURE_2D, inputTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inputImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.bindTexture(gl.TEXTURE_2D, noiseTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, noiseImage)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    if (!vertexShader || !fragmentShader) {
      reject(new Error('Failed to create shaders'))
      return
    }

    gl.shaderSource(
      vertexShader,
      `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `
    )
    gl.shaderSource(fragmentShader, shaderSource)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      reject(new Error(`Vertex shader compilation failed: ${gl.getShaderInfoLog(vertexShader)}`))
      return
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      reject(new Error(`Fragment shader compilation failed: ${gl.getShaderInfoLog(fragmentShader)}`))
      return
    }

    const program = gl.createProgram()
    if (!program) {
      reject(new Error('Failed to create program'))
      return
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      reject(new Error(`Program linking failed: ${gl.getProgramInfoLog(program)}`))
      return
    }

    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    if (!positionBuffer) {
      reject(new Error('Failed to create position buffer'))
      return
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const uniforms: ShaderUniforms = {
      iResolution: [width, height, 0],
      iChannel0: inputTexture,
      iChannel1: noiseTexture,
      iTime: performance.now() / 1000,
    }

    setShaderUniforms(gl, program, uniforms)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    const pixels = new Uint8ClampedArray(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    const imageData = new ImageData(pixels, width, height)

    const drawCanvas = document.getElementById('draw') as HTMLCanvasElement
    const ctx = drawCanvas.getContext('2d')
    if (ctx) {
      ctx.putImageData(imageData, 0, 0)
      resolve(canvas)
    } else {
      reject(new Error('Failed to get 2d context'))
    }
  })
}

function setShaderUniforms(gl: WebGLRenderingContext, program: WebGLProgram, uniforms: ShaderUniforms) {
  const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
  if (resolutionLocation && uniforms.iResolution) {
    gl.uniform3fv(resolutionLocation, uniforms.iResolution)
  }

  const timeLocation = gl.getUniformLocation(program, 'iTime')
  if (timeLocation && uniforms.iTime !== undefined) {
    gl.uniform1f(timeLocation, uniforms.iTime)
  }

  for (let i = 0; i < 2; i++) {
    const channelLocation = gl.getUniformLocation(program, `iChannel${i}`)
    if (channelLocation && uniforms[`iChannel${i}`]) {
      gl.activeTexture(gl[`TEXTURE${i}`])
      gl.bindTexture(gl.TEXTURE_2D, uniforms[`iChannel${i}`])
      gl.uniform1i(channelLocation, i)
    }
  }
}

const shaderCode = `#version 300 es
precision highp float;

uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

out vec4 fragColor;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;

    vec4 tiledColor = texture(iChannel0, uv * 10.0);

    float noise = texture(iChannel1, uv * 2.0).r;

    vec2 offsetUV = uv + (noise - 0.5) * 0.05;
    vec4 offsetColor = texture(iChannel0, offsetUV * 10.0);

    fragColor = mix(tiledColor, offsetColor, noise);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
`

function saveImage() {
  const drawCanvas = document.getElementById('draw') as HTMLCanvasElement
  const dataURL = drawCanvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataURL
  link.download = 'shader_output.png'
  link.click()
}

onMounted(() => {
  const inputImage = document.getElementById('inputImage') as HTMLImageElement
  const noiseImage = document.getElementById('noiseImage') as HTMLImageElement
  const canvas = document.getElementById('shader') as HTMLCanvasElement

  if (inputImage && noiseImage && canvas) {
    inputImage.onload = () => {
      noiseImage.onload = () => {
        processImageWithShader(inputImage, noiseImage, shaderCode, canvas)
          .then(canvas => {
            console.log('finished: ', canvas)
          })
          .catch(error => {
            console.error('Error processing image:', error)
          })
      }
    }
  } else {
    console.error('inputImage, noiseImage or canvas element not found')
  }
})
</script>

<style scoped lang="sass"></style>
