const paragraphs = document.querySelectorAll('p');
paragraphs.forEach(p => {
    if (p.textContent.includes('Llamas and Chickens!')) {
        p.style.color = 'red';
    }
});