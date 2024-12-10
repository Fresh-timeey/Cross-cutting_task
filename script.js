let percentage = 0;

let interval = setInterval(() => {
    percentage += 1;
    document.getElementById("loading-text").innerText = `${percentage}%`;

    if (percentage === 100) {
        clearInterval(interval);
        document.getElementById("preloader").style.display = 'none'; // Прячем предзагрузчик
        document.getElementById("content").style.display = 'flex';  // Показываем основной контент
    }
}, 50);



// Обновление прогресса каждые 50 миллисекунд
  
    
    
    document.addEventListener('DOMContentLoaded', () => {const music = document.getElementById('bg-music');
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
        const workArea = document.getElementById('work-area');
        const fileList = document.getElementById('fileList');
        const fileContent = document.getElementById('fileContent');
        const processedContent = document.getElementById('processedContent');
        const addFileButton = document.getElementById('addFileButton');
        const downloadButton = document.getElementById('downloadButton');
    
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
    
        // Обработчик для кнопки "Добавить файл", выбираем файлы с устройства
        addFileButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true; // позволяет выбрать несколько файлов
            input.click();
    
            input.addEventListener('change', (e) => {
                handleFiles(e.target.files);
            });
        });
    
        // Функция для обработки файлов
        function handleFiles(newFiles) {
            // Добавляем выбранные файлы в массив
            Array.from(newFiles).forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    files.push({ name: file.name, content: event.target.result });
                    renderFileList();
                };
                reader.readAsText(file);
            });
    
            workArea.style.display = 'flex'; // Показываем рабочую область
            setTimeout(() => {
                workArea.style.opacity = '1'; // Плавное появление
            }, 0);
        }
    
        // Отображение списка файлов
        function renderFileList() {
            fileList.innerHTML = ''; // Очистить текущий список
            files.forEach((file, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span class="icon">📄</span>${file.name}`;
                listItem.addEventListener('click', () => displayFileContent(index));
                fileList.appendChild(listItem);
            });
        }
    
        // Отображение содержимого выбранного файла
        function displayFileContent(index) {
            fileContent.value = files[index].content;
            processedContent.value = `Обработанное содержимое для ${files[index].name}`;
        }
    
        // Скачивание обработанного файла
        downloadButton.addEventListener('click', () => {
            const blob = new Blob([processedContent.value], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'processed_file.txt';
            link.click();
        });
    });