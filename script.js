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








document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon'); // Иконка изображения

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
        input.multiple = true; // Позволяет выбрать несколько файлов
        input.click();

        input.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    });

    // Функция для обработки файлов
    function handleFiles(newFiles) {
        files = [...files, ...newFiles];

        // Обновляем список файлов
        fileList.innerHTML = '';
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = file.name;
            fileItem.style.cursor = 'pointer'; // Указываем, что элемент кликабельный
            fileItem.addEventListener('click', () => displayFileContent(file)); // Добавляем обработчик клика
            fileList.appendChild(fileItem);
        });

        // Когда файлы выбраны, скрываем ненужные элементы
        if (files.length > 0) {
            document.getElementById('text-box').style.display = 'none'; // Скрыть текст
            uploadBtn.style.display = 'none'; // Скрыть кнопку выбора файлов

            // Показываем рабочую область
            workArea.style.display = 'flex';
            setTimeout(() => {
                workArea.style.opacity = '1'; // Плавное появление рабочей области
            }, 0);
        }
    }

    // Функция для отображения содержимого выбранного файла
    function displayFileContent(file) {
        const fileType = file.type;

        // Очистка содержимого перед отображением
        fileContent.innerHTML = '';
        processedContent.value = `Обработанное содержимое для ${file.name}`;

        if (fileType === 'application/pdf') {
            renderPDF(file);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            renderWord(file);
        } else if (fileType.startsWith('image/')) {
            renderImage(file);
        } else {
            fileContent.textContent = 'Этот формат файла не поддерживается для отображения.';
        }
    }

    function renderPDF(file) {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
    
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const pdfData = new Uint8Array(this.result);
    
            pdfjsLib.getDocument(pdfData).promise.then((pdf) => {
                const numPages = pdf.numPages;
                const contentDiv = document.getElementById('fileContent'); // Контейнер для текста
                contentDiv.innerHTML = ''; // Очищаем перед отображением текста
    
                let textContent = '';
    
                const promises = [];
                for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                    promises.push(
                        pdf.getPage(pageNumber).then((page) => {
                            return page.getTextContent().then((text) => {
                                text.items.forEach((item) => {
                                    textContent += item.str + ' ';
                                });
                            });
                        })
                    );
                }
    
                Promise.all(promises).then(() => {
                    contentDiv.textContent = textContent.trim(); // Отображаем весь текст в контейнере
                }).catch((err) => {
                    contentDiv.textContent = 'Ошибка при извлечении текста из PDF.';
                    console.error('Ошибка извлечения текста:', err);
                });
            }).catch((err) => {
                document.getElementById('fileContent').textContent = 'Ошибка загрузки PDF.';
                console.error('Ошибка загрузки PDF:', err);
            });
        };
    
        fileReader.readAsArrayBuffer(file);
    }
    


    // Функция для отображения содержимого Word-файла
    function renderWord(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = event.target.result;
            mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then((result) => {
                fileContent.textContent = result.value;
            }).catch(() => {
                fileContent.textContent = 'Не удалось прочитать содержимое Word-файла.';
            });
        };
        reader.readAsArrayBuffer(file);
    }

    // Функция для отображения изображения
    function renderImage(file) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        fileContent.appendChild(img);
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




