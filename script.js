/* script.js */

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
    
    document.getElementById('toggle-music').addEventListener('click', () => {
        if (music.paused) {
            music.play();
            musicIcon.src = 'audio_on.png'; // Изменение на "включённая музыка"
        } else {
            music.pause();
            musicIcon.src = 'audio_out.png'; // Изменение на "выключённая музыка"
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const fileSelector = document.getElementById('file-selector');
    const fileList = document.getElementById('file-list');

    let filesArray = [];

    // Перетаскивание файлов
    fileSelector.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileSelector.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    });

    fileSelector.addEventListener('dragleave', () => {
        fileSelector.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    });

    fileSelector.addEventListener('drop', (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        addFiles(files);
    });

    // Обработка файлов с буфера обмена
    document.addEventListener('paste', (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                addFiles([file]);
            }
        }
    });

    // Обработка файлов из input
    uploadBtn.addEventListener('click', () => {
        const files = fileInput.files;
        addFiles(files);
    });

    // Добавляем файлы в список
    function addFiles(files) {
        for (let i = 0; i < files.length; i++) {
            filesArray.push(files[i]);
        }
        updateFileList();
        location.reload(); // Перезагружаем страницу после добавления файлов
    }

    // Обновляем отображение списка файлов
    function updateFileList() {
        fileList.innerHTML = ''; // Очистить список перед добавлением новых элементов

        filesArray.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.classList.add('file-item');

            // Иконка файла
            const fileIcon = document.createElement('img');
            fileIcon.src = 'file-icon.png'; // Указываем путь к иконке файла
            fileItem.appendChild(fileIcon);

            // Название файла и тип
            const fileName = document.createElement('p');
            fileName.innerText = `${file.name} (${file.type})`;
            fileItem.appendChild(fileName);

            fileList.appendChild(fileItem);
        });
    }
});
