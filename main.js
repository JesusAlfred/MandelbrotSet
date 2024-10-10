import './style.css'

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;

const X1 = -2;
const X2 = 1;
const Y1 = -1;
const Y2 = 1;

const p = 100;

let scale = 0.8221188003905089;

let coordY = 0;
let coordX = 0;

const canvas = document.querySelector("#board");
const ctx = canvas.getContext("2d");

const slider = document.querySelector("#slider");

slider.addEventListener("input", (event) => {
  let value = Math.E ** (event.target.value*2) - 1;
  scale = value;
  vel = 1 / scale;
  update();
});

canvas.width = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;
update()
function update(){
  for (let y = 0; y < BOARD_HEIGHT; y++){
    for (let x = 0; x < BOARD_WIDTH; x++){
      const caculatedColor = getColor(x, y);
      paint(x, y, Math.floor(mapColor(caculatedColor, 0, 255)));
    }
  }
}

let vel = 0.2
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
  
  const LeftLimit   = coordX + X1 / scale;
  const RightLimit  = coordX + X2 / scale;
  const TopLimit    = coordY + Y1 / scale;
  const BottomLimit = coordY + Y2 / scale;

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
  let colorTransform = `rgb(${color}, ${color}, ${color})`;
  
  
  ctx.fillStyle = colorTransform;
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