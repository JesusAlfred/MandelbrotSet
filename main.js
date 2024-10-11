import './style.css'

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const BLOCK_SIZE = 1;

const X1 = -2;
const X2 = 1;
const Y1 = -1;
const Y2 = 1;

let LeftLimit;
let RightLimit;
let TopLimit;
let BottomLimit;



let scale = 0.8221188003905089;
const initialP = 100;
let p = initialP;
let vel = 0.2

let coordY = 0;
let coordX = -1.484583315209498;

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const slider = document.querySelector("#slider");
const pSlider = document.querySelector("#p");

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

slider.addEventListener("input", (event) => {
  let value = Math.E ** (event.target.value*2) - 1;
  scale = value;
  vel = 1 / scale;
  //p = initialP * (Math.floor(event.target.value) + 1)
  update();
});

pSlider.addEventListener("input", (event) => {
  p = event.target.value;
  update();
});

let calculateSection = function (start, end) {
  return new Promise((resolve, reject) => {
    for (let y = start; y < end; y++){
      for (let x = 0; x < BOARD_WIDTH; x++){
        const caculatedColor = getColor(x, y);
        paint(x, y, Math.floor(mapColor(caculatedColor, 0, 100)));
      }
    }
    resolve()
  });
};
const steps = 100;
async function update(){
  //console.log(coordX, coordY);
  LeftLimit   = coordX + X1 / scale;
  RightLimit  = coordX + X2 / scale;
  TopLimit    = coordY + Y1 / scale;
  BottomLimit = coordY + Y2 / scale;
  for (let i = 0; i < BOARD_HEIGHT; i+=steps) {
    setTimeout(() => {
      calculateSection(i, i+steps)
    }, 0);
  }
}

document.addEventListener("keydown", (event) => {
  switch(event.key){
    case "ArrowDown":
        coordY+=vel;
        break;
      case "ArrowUp":
        coordY-=vel;
        break;
      case "ArrowLeft":
        coordX-=vel;
        break;
      case "ArrowRight":
        coordX+=vel;
        break;
  }
  update()
});



function getColor(x, y){
  let real = mapNumber(x, 0, BOARD_WIDTH, LeftLimit, RightLimit);
  let I = mapNumber(y, 0, BOARD_HEIGHT, TopLimit, BottomLimit);
  let zR = 0;
  let zI = 0;
  let i = 0;
  while(i<p){
    const temp_zR = (zR * zR - zI * zI);
    zI = 2 * (zR*zI) + I;
    zR = temp_zR + real;

    const absValue = zR**2 + zI**2;

    if (absValue>4){
      break;
    }

    
    i++;
  }
  return p-i;
}


function paint(x, y, color){
  ctx.fillStyle = perc2color(color);;
  ctx.fillRect(x, y, 1, 1);
}

function mapColor(color, min, max){
  const steps = (max - min) / p;
  return min + color * steps;
}

function mapNumber(n, min1, max1, min2, max2){
  const steps = (max2 - min2) / (max1-min1);
  return min2 + steps * n;

}

function perc2color(perc) {
  if (perc === 0) {
    return "hsl(0 0% 0%)"
  }
  const hue = perc  * 3.60;
  return `hsl(${hue}, 100%, 50%)`;
}

update()