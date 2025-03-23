import { delay, panic, success } from "../utils";
import { ColaEngine, ShaderKind } from "./cola-engine";
import { UIManger } from "./dom";
import { Network } from "./network";

const network = new Network();
const ui = new UIManger(document);

network.onConnectionLost.subscribe(async ()=>{
    ui.setTitle(ui.title.textContent += " - Connection Lost");
    await delay(1000);
    window.close();
});

network.start();
ui.setTitle("Jump For Ever");
const body = document.body;
const stats = document.getElementById("stats");

ui.onResize.subscribe(async ()=>{
    //await new Promise(res=>setTimeout(res, 1000));
    let h = body.clientHeight, w = body.clientWidth;
    if(h < 400) h = 30;
    else h = 0;

    if(w < 500) w = 30;
    else w = 0;
    if(h || w) window.resizeBy(w, h);
});

const vShaderSrc = `#version 300 es
precision mediump float;

in vec2 aPosition;
in vec2 aTexPosition;

uniform vec2 uScale;
uniform vec2 uOffset;

out vec2 vTexPosition;

void main() {
    vTexPosition = aTexPosition;
    gl_Position = vec4(aPosition * uScale + uOffset, 0.0, 0.1);
}
`;
const fShaderSrc = `#version 300 es
precision lowp float;

in vec2 vTexPosition;

uniform sampler2D uSampler;

out vec4 fragColor;

void main() {
  fragColor = texture(uSampler, vTexPosition);
}
`;

const engine = ColaEngine.fromCanvas(ui.canvas);
const program = engine.createProgram();

program.attachShader(engine.createShader(vShaderSrc, ShaderKind.VertexShader));
program.attachShader(engine.createShader(fShaderSrc, ShaderKind.FragmentShader));
let failed = program.link();

if(failed)
    throw undefined;

const img = new Image();
img.src = "/assets/dirt-step.png";
await new Promise(r=>img.onload=r);
console.log("Img loaded");

const gl = engine.api;
const glProgram = program.handle;

engine.clear();



gl.useProgram(glProgram);
console.log(gl.getAttribLocation(glProgram, "aColor"), gl.getAttribLocation(glProgram, "aPosition"));
const vertexDatabuffer = new Float32Array([
    -1,  1,
     1,  1,
     1, -1,
    -1,  1,
    -1, -1,
     1, -1
]);

const textDataBuffer = new Float32Array([
    0, 1,
    32/128, 1,
    32/128, 1 - 8/32,
   0, 1,
    0, 1 - 8/32,
   32/128, 1 - 8/32
])


const vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexDatabuffer, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

const tBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
gl.bufferData(gl.ARRAY_BUFFER, textDataBuffer, gl.STATIC_DRAW);
gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(1);

const texture = gl.createTexture();
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);

gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


gl.bindBuffer(gl.ARRAY_BUFFER, null);

let s = performance.now();
for(let y = -0.08; y < 0.09; y += 0.02) for(let i = -0.08; i < 0.09; i += 0.02){
    gl.uniform2f(gl.getUniformLocation(glProgram, "uOffset"), i, y);
    gl.uniform2f(gl.getUniformLocation(glProgram, "uScale"), 0.01, 0.005);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
console.log(performance.now()-s)

console.log("SUCCESSFULLY LOADED");

function run(): void {
    const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        throw panic("Failed to get GL context");
    }

    //new Scope
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const triangle = new Float32Array([
        -0.3, 0.7,
        0.3, 0.6,
        -0.3, -0.6,
        0, -0.8,
    ]);

    const triangleBuffer = gl.createBuffer()!;

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);


    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(vertexShader);
        console.error(compileError);
        return;
    }


    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        const compileError = gl.getShaderInfoLog(fragmentShader);
        console.error(compileError);
        return;
    }

    const glProgram = gl.createProgram();
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);

    gl.linkProgram(glProgram);
    if(!gl.getProgramParameter(glProgram, gl.LINK_STATUS)){
        const compileError = gl.getProgramInfoLog(glProgram);
        console.error(compileError);
        return;
    }

    const vertexPositionAttributeLocation = gl.getAttribLocation(glProgram, "vertexPosition");
    if(vertexPositionAttributeLocation < 0){
        console.error("Failed to get attributeLocation");
        return;
    }

    
    const colorUniformPointer = gl.getUniformLocation(glProgram, "uShadeColor");
    console.log(colorUniformPointer);
    gl.useProgram(glProgram);
    gl.uniform1f(colorUniformPointer, 0.8); //Store data to the shader's uniform variable uPointSize


    //Output merger
    gl.enableVertexAttribArray(vertexPositionAttributeLocation);

    let size = canvas.width = canvas.height = Math.min(body.clientWidth, body.clientHeight);
    gl.viewport(0, 0, size, size);
    window.addEventListener("resize",()=>{
        size = Math.min(body.clientWidth, body.clientHeight);
    });
    let fps = 50;
    let delta = 1_000 / 100;
    setInterval(()=>{
        fps = s * 2;
        s = 0;
    }, 500);
    setInterval(()=>{
        stats!.textContent = "FPS: " + fps;
    }, 200);
    let s = 0;
    let oldSize = size;
    let last = Math.random();
    const frame: ()=>void = async ()=>{
        //RENDER
        
        await new Promise(res=>setTimeout(res,10));
        for(let i = 0; i < triangle.length; i++) triangle[i] += 0.01 * ((last = last*0.2 + (Math.random() - 0.5)));
        //new Scope
        
        if(size !== oldSize){
            oldSize = canvas.width = canvas.height = size;
            // Rasterizer
            gl.viewport(0,0,size,size);
        }

        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set GPU program
        gl.useProgram(glProgram);
        
            
        // Input Assembly
        //update before to be sure
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.STATIC_DRAW);
        gl.vertexAttribPointer(
            vertexPositionAttributeLocation,
            2, //size of object
            gl.FLOAT,
            false, // converts from int to floats, x -> 0.5 or x > x.0
            2 * Float32Array.BYTES_PER_ELEMENT, // Steps 
            0  // reading offset
        );

        //Draw call
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangle.length / 2);
        s++;
        // Assign frame loop
        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
}
function run2(): number {
    const engine = EngineContext.fromCanvas(canvas);
    
    const program = engine.createProgram();
    // Setup block
    {

        //Create vertex shader
        const vertexShader = engine.createShader(vertexShaderCode, {}, ShaderKind.VertexShader);
        let failed = vertexShader.compile();
        if(failed)
            return panic("Failed to compile shader: \n" + vertexShader);

        // create fragment shader
        const fragmentShader = engine.createShader(fragmentShaderCode, {}, ShaderKind.FragmentShader);
        failed = fragmentShader.compile();
        if(failed)
            return panic("Failed to compile shader: \n" + fragmentShader);

        // build program with shader
        program.attachShader(vertexShader);
        program.attachShader(fragmentShader);
        failed = program.link();
        if(failed)
            return panic("Failed to link program");
    }

    let r = 0;
    function render(): void{
        engine.setClearColor(new ClearColor((r = (++r % 255))/255, 0.5, 0.2));
        engine.clear();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    return success();
}