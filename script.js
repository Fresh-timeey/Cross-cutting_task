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




  //  const math = window.math;
    let files = [];

    // Подключаем библиотеки
    const JSZip = window.JSZip;
    const CryptoJS = window.CryptoJS;

    // Поддерживаемые форматы
    const supportedFormats = ['text/plain', 'application/json', 'application/xml', 'application/x-yaml'];

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
    async function displayFileContent(file) {
        const fileType = file.type;

        fileContent.innerHTML = '';
        processedContent.value = `Обработанное содержимое для ${file.name}`;

        if (fileType === 'application/pdf') {
            renderPDF(file);
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            renderWord(file);
        } else if (fileType.startsWith('text/') || supportedFormats.includes(fileType)) {
            const content = await readFile(file);
            fileContent.textContent = content;
            processedContent.value = `Обработанное содержимое: ${file.name}`;
        } else if (fileType === 'application/zip') {
            const files = await handleZip(file);
            displayFiles(files);
        } else {
            fileContent.textContent = 'Этот формат файла пока что не поддерживается для отображения(';
        }
    }

    // Чтение файла
    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Обработка zip-архивов
    async function handleZip(file) {
        const zip = new JSZip();
        const unzipped = await zip.loadAsync(file);
        const files = [];

        for (const fileName in unzipped.files) {
            const file = unzipped.file(fileName);
            if (file) {
                const content = await file.async('string');
                files.push({ name: fileName, content });
            }
        }

        return files;
    }

    function renderPDF(file) {
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const pdfData = new Uint8Array(this.result);
            pdfjsLib.getDocument(pdfData).promise.then((pdf) => {
                const numPages = pdf.numPages;
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
                    fileContent.textContent = textContent.trim();
                }).catch(() => {
                    fileContent.textContent = 'Ошибка при извлечении текста из PDF.';
                });
            }).catch(() => {
                fileContent.textContent = 'Ошибка загрузки PDF.';
            });
        };
        fileReader.readAsArrayBuffer(file);
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





//Для Unit-тестов

module.exports = {
    handleFiles,
    renderWord,
    renderPDF
};
