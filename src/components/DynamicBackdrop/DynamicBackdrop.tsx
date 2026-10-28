import { useEffect, useRef } from 'react'

import styles from './DynamicBackdrop.module.css'

export type BackdropVariant = 'desktop' | 'authentication' | 'surveillance' | 'access'

type DynamicBackdropProps = {
  variant: BackdropVariant
}

const variantValue: Record<BackdropVariant, number> = {
  desktop: 0,
  authentication: 1,
  surveillance: 2,
  access: 3,
}

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mode;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float line(float value, float width) {
  return 1.0 - smoothstep(0.0, width, abs(value));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float t = u_time;

  float modePulse = 0.5 + 0.5 * sin(u_mode * 1.7);
  vec3 base = mix(vec3(0.018, 0.022, 0.030), vec3(0.040, 0.013, 0.019), 0.42 + modePulse * 0.16);
  vec3 color = base;

  float slowWave = sin(p.x * 2.7 + t * 0.21 + u_mode) * 0.085;
  float ribbonA = line(p.y - slowWave + 0.06, 0.12);
  float ribbonB = line(p.y + sin(p.x * 4.1 - t * 0.16) * 0.055 - 0.24, 0.055);
  color += vec3(0.34, 0.018, 0.035) * ribbonA * 0.34;
  color += vec3(0.56, 0.035, 0.058) * ribbonB * 0.19;

  float diagonal = fract((p.x * 0.72 + p.y * 0.34 - t * 0.026) * 4.0);
  float blade = smoothstep(0.47, 0.5, diagonal) - smoothstep(0.5, 0.54, diagonal);
  color += vec3(0.5, 0.045, 0.065) * blade * 0.12;

  vec2 orbitCenter = p - vec2(0.32 + sin(t * 0.09) * 0.08, 0.02);
  float orbitDistance = length(orbitCenter);
  float orbitA = line(orbitDistance - 0.29 - sin(atan(orbitCenter.y, orbitCenter.x) * 5.0 + t * 0.42) * 0.012, 0.006);
  float orbitB = line(orbitDistance - 0.43 - cos(atan(orbitCenter.y, orbitCenter.x) * 3.0 - t * 0.24) * 0.018, 0.004);
  float orbitMask = smoothstep(-0.3, 0.55, orbitCenter.x) * smoothstep(-0.42, 0.38, orbitCenter.y);
  color += vec3(0.68, 0.055, 0.09) * orbitA * orbitMask * 0.22;
  color += vec3(0.22, 0.10, 0.14) * orbitB * orbitMask * 0.13;

  float telemetry = sin((p.y + sin(p.x * 8.0 + t * 0.7) * 0.018) * 62.0 - t * 1.8);
  telemetry = smoothstep(0.91, 0.99, telemetry) * smoothstep(0.22, 0.65, abs(p.x));
  color += vec3(0.58, 0.05, 0.08) * telemetry * 0.055;

  vec2 gridUv = uv * vec2(18.0, 10.0);
  vec2 gridDistance = min(fract(gridUv), 1.0 - fract(gridUv));
  float grid = 1.0 - smoothstep(0.0, 0.035, min(gridDistance.x, gridDistance.y));
  color += vec3(0.12, 0.14, 0.18) * grid * 0.11;

  vec2 particleCell = floor(uv * vec2(34.0, 20.0));
  float particleSeed = hash(particleCell);
  vec2 particleUv = fract(uv * vec2(34.0, 20.0)) - 0.5;
  float particle = smoothstep(0.09, 0.0, length(particleUv)) * step(0.91, particleSeed);
  float flicker = 0.3 + 0.7 * sin(t * (0.7 + particleSeed) + particleSeed * 20.0) * 0.5 + 0.35;
  color += vec3(0.86, 0.16, 0.19) * particle * flicker * 0.34;

  vec2 glowPosition = vec2(sin(t * 0.11 + u_mode) * 0.48, cos(t * 0.08) * 0.22);
  float glow = 0.18 / (0.3 + length(p - glowPosition) * 2.8);
  color += vec3(0.31, 0.018, 0.035) * glow;

  float scan = line(fract(uv.y * 1.8 - t * 0.065) - 0.5, 0.035);
  color += vec3(0.42, 0.06, 0.075) * scan * 0.08;

  float vignette = smoothstep(0.95, 0.18, length(p * vec2(0.72, 1.0)));
  color *= 0.45 + vignette * 0.7;
  color += (hash(gl_FragCoord.xy + t) - 0.5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}
`

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function DynamicBackdrop({ variant }: DynamicBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const variantRef = useRef(variantValue[variant])

  useEffect(() => {
    variantRef.current = variantValue[variant]
  }, [variant])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || navigator.userAgent.toLowerCase().includes('jsdom')) return

    let gl: WebGLRenderingContext | null = null
    try {
      gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      })
    } catch {
      return
    }
    if (!gl) return

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = gl.createProgram()
    if (!vertexShader || !fragmentShader || !program) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'u_resolution')
    const time = gl.getUniformLocation(program, 'u_time')
    const mode = gl.getUniformLocation(program, 'u_mode')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let currentMode = variantRef.current
    let animationFrame = 0
    let startTime = performance.now()

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.max(1, Math.floor(window.innerWidth * pixelRatio))
      const height = Math.max(1, Math.floor(window.innerHeight * pixelRatio))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const render = (timestamp: number) => {
      resize()
      currentMode += (variantRef.current - currentMode) * 0.035
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, (timestamp - startTime) / 1_000)
      gl.uniform1f(mode, currentMode)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!reduceMotion.matches && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render)
      }
    }

    const resume = () => {
      window.cancelAnimationFrame(animationFrame)
      if (!document.hidden) {
        startTime = performance.now()
        animationFrame = window.requestAnimationFrame(render)
      }
    }

    const handleMotionChange = () => resume()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', resume)
    reduceMotion.addEventListener('change', handleMotionChange)
    resize()
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', resume)
      reduceMotion.removeEventListener('change', handleMotionChange)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [])

  return (
    <div aria-hidden="true" className={styles.backdrop}>
      <canvas ref={canvasRef} />
      <div className={styles.fallback} />
      <div className={styles.vignette} />
      <div className={styles.scanlines} />
    </div>
  )
}
