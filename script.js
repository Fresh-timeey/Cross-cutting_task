let percentage = 0;
let interval = setInterval(() => {
    percentage += 1;
    document.getElementById("loading-text").innerText = `${percentage}%`;

    if (percentage === 100) {
        clearInterval(interval);
        document.getElementById("preloader").style.display = 'none'; // Прячем предзагрузчик
        document.getElementById("content").style.display = 'flex';  // Показываем основной контент
    }
}, 50); // Обновление прогресса каждые 50 миллисекунд
