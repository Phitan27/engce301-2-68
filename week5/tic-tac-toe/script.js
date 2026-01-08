const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

function changeToX(event) {
  const container = event.currentTarget;
  const image = document.createElement('img');
  image.src = X_IMAGE_URL;
  container.appendChild(image);
  container.removeEventListener('click', changeToX);
  computerChooseO();
}

function computerChooseO() {
  const allBoxes  = document.querySelectorAll('#grid div');
  const freeBoxes = [];
  for (const box of allBoxes) {
    let imageChild = box.querySelector('img');
    if (!imageChild) {
      freeBoxes.push(box);
    }
  }
  const index = Math.floor(Math.random() * freeBoxes.length);
  console.log('freeBoxes.length: '+freeBoxes.length);
  console.log('index: '+index);
  const freeSpace = freeBoxes[index];
  const image = document.createElement('img');
  image.src = O_IMAGE_URL;
  freeSpace.removeEventListener('click', changeToX);
  freeSpace.appendChild(image);
}

const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', changeToX);
}