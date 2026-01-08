let nav = document.getElementsByTagName('nav');

let ul = document.getElementById('ul');

const item = document.querySelectorAll('li');

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener('click', function() {
        alert(this.textContent);
    });
}