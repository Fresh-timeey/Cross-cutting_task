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

document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');  // Иконка изображения
    
    // Обработчик для кнопки музыки
    document.getElementById('toggle-music').addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicIcon.src = 'audio_on.png'; // Изменение на "включённая музыка"
        } else {
            music.pause();
            musicIcon.src = 'audio_out.png'; // Изменение на "выключённая музыка"
        }
    });

    const uploadBtn = document.getElementById('upload-btn');
    const dropArea = document.getElementById('drop-area');
    const fileList = document.getElementById('file-list');
    const content = document.getElementById('content');

    let files = [];

    // Обработчик для кнопки загрузки файлов
    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.click();

        input.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    });

    // Обработчик для перетаскивания файлов
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        const droppedFiles = e.dataTransfer.files;
        handleFiles(droppedFiles);
    });

    // Функция для обработки файлов
    function handleFiles(newFiles) {
        files = [...files, ...newFiles];

        // Обновляем список файлов
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = file.name;
            fileList.appendChild(fileItem);
        });

        // Меняем фон страницы, если файлы выбраны
        if (files.length > 0) {
            content.style.backgroundColor = '#fff'; // Становится белым
            document.getElementById('text-box').style.display = 'none'; // Скрыть текст
            uploadBtn.style.display = 'none'; // Скрыть кнопку
        }   
       
   // Показать рабочую область
const workArea = document.getElementById('work-area');
workArea.style.display = 'block';
setTimeout(() => {
    workArea.style.opacity = '1'; // Плавное появление
}, 0);

    }

});
