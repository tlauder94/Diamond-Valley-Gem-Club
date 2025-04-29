document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('annoucementheader').innerHTML =  "";
    document.getElementById('annoucement-text').innerHTML = "";

    fetch('https://script.google.com/macros/s/AKfycbyjn7AgTtRZFd9PhnyNTfVcQaLNX6TGT8TPJnx5HzM/dev')
    .then(res => res.json())
    .then((res) => {
        const data = res.data;
        document.getElementById('annoucement-header').innerHTML =  data[0].title;
        document.getElementById('annoucement-text').innerHTML = data[0].message;
    });

    // Debounce utility function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(this, args), delay);
        };
      }    


    } )     