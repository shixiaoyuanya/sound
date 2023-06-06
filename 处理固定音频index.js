const audioEle =document.querySelector('audio')

const cvs =document.querySelector('canvas')

const ctx =cvs.getContext('2d')

// 初始化canvas的尺寸 
function initCve (){
    const size =500 ;
    cvs.width =size *devicePixelRatio;
    cvs.height =size * devicePixelRatio;
    cvs.style.width =cvs.style.height =size + 'px';
}
initCve();
function draw(datas, maxValue) {
    const r = cvs.width / 4 + 20 * devicePixelRatio;
    const center = cvs.width / 2;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    
    const hslStep = 360 / (datas.length - 1);
    const maxLen = cvs.width / 2 - r;
    const minLen = 2 * devicePixelRatio;
    for (let i = 0; i < datas.length; i++) {
      ctx.beginPath();
      const len = Math.max((datas[i] / maxValue) * maxLen, minLen);
      const rotate = hslStep * i;
      ctx.strokeStyle = `hsl(${rotate}deg, 65%, 65%)`;
      ctx.lineWidth = minLen;
      const rad = (rotate * Math.PI) / 180;
      const beginX = center + Math.cos(rad) * r;
      const beginY = center + Math.sin(rad) * r;
      const endX = center + Math.cos(rad) * (r + len);
      const endY = center + Math.sin(rad) * (r + len);
      ctx.moveTo(beginX, beginY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }
draw(new Array(256).fill(0),255)
// 监听音屏播方 
let isInit =false ;
let analyser ,buffer;
// navigator.mediaDevices.getUserMedia({audio :true} ).then
// ((stream)=>{

//设备


audioEle.onplay =function() {
    if (isInit) {
        return
     }
     const  audioCtx =new AudioContext();
    //  初始化音频上下文 
  analyser =audioCtx.createAnalyser()
    //创建一个音频分析器节点

    // analyser.getByteFrequencyData()
    // 频率数据
    analyser.fftSize = 512 
    // 定义分析结果数组长度
 buffer = new Uint8Array(analyser.frequencyBinCount)
    // analyser.getByteTimeDomainData(数组)
    // 时域数据
const source = audioCtx.createMediaElementSource(audioEle)
// 音频来源元素 
// const source = audioCtx.createMediaElementSource(stream)
// 获取音频来源 

source.connect(analyser)
// 音频来源和分析器链接

analyser.connect(audioCtx.destination)
// 使用分析器节点连接上下文的输出目标 链接到喇叭
isInit=true
// })
}
 function upDate(){
    requestAnimationFrame(upDate)
    if (!isInit) {
  return
    }
    analyser.getByteFrequencyData(buffer)
    // 频率数据 通过频率图拿到不同频率下的功率
const offset =Math.floor((buffer.length * 2) /3)
// 获取部分频率     // 
const datas = new Array(offset *2)
for (let i = 0; i < offset; i++) {
    datas[i] =datas[datas.length -i -1]=buffer[i]

 }
draw(datas ,255) 
 }
 upDate()