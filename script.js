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
        } else if (fileType === 'text/plain') {
            renderPlainText(file);
        } else if (fileType === 'application/xml' || fileType === 'text/xml') {
            renderXML(file);
        } else if (fileType === 'application/json') {
            renderJSON(file);
        } else if (fileType === 'application/x-yaml' || fileType === 'text/yaml' || fileType === 'text/x-yaml') {
            renderYAML(file);
        } else {
            fileContent.textContent = 'Этот формат файла пока что не поддерживается для отображения(';
        }




        const reader = new FileReader();

        reader.onload = function (event) {
            const text = event.target.result;
    
            // Для всех текстовых форматов извлекаем и вычисляем арифметические операции
            if (fileType === 'application/pdf') {
                renderPDF(file);
            } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                renderWord(file);
            } else
            if (fileType === 'text/plain' || fileType === 'application/json' || fileType === 'application/xml' || fileType === 'text/xml') {
                const result = extractAndCalculateOperations(text);
                processedContent.value = result; // Выводим результат в третью колонку
            } else {
                processedContent.value = `Арифметические операции не были найдены в файле ${file.name}`;
            }
        };
    
        reader.readAsText(file);



    }
// Функция для отображения содержимого PDF файла
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
                const result = extractAndCalculateOperations(textContent.trim());
                processedContent.value = result; // Выводим результат в третью колонку
            }).catch((err) => {
                processedContent.value = `Арифметические операции не были найдены в файле ${file.name}`;
                console.error('Ошибка извлечения текста:', err);
            });
        }).catch((err) => {
            processedContent.value = `Арифметические операции не были найдены в файле ${file.name}`;
            console.error('Ошибка загрузки PDF:', err);
        });
    };

    fileReader.readAsArrayBuffer(file);
}
    


   // Функция для отображения содержимого Word файла
function renderWord(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const arrayBuffer = event.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then((result) => {
            fileContent.textContent = result.value;
            const text = result.value;
            const operationResults = extractAndCalculateOperations(text);
            processedContent.value = operationResults; // Выводим результат в третью колонку
        }).catch(() => {
            processedContent.value = `Арифметические операции не были найдены в файле ${file.name}`;
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

     // Функция для отображения содержимого текста
     function renderPlainText(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            fileContent.textContent = event.target.result;
        };
        reader.readAsText(file);
    }

    // Функция для отображения XML
    function renderXML(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(event.target.result, 'application/xml');
            fileContent.textContent = new XMLSerializer().serializeToString(xmlDoc);
        };
        reader.readAsText(file);
    }

    // Функция для отображения JSON
    function renderJSON(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const json = JSON.parse(event.target.result);
                fileContent.textContent = JSON.stringify(json, null, 2); // Отображаем отформатированный JSON
            } catch (error) {
                fileContent.textContent = 'Ошибка при парсинге JSON.';
            }
        };
        reader.readAsText(file);
    }

    // Функция для отображения YAML
    function renderYAML(file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const yaml = jsyaml.load(event.target.result);
                fileContent.textContent = JSON.stringify(yaml, null, 2); // Отображаем YAML как JSON
            } catch (error) {
                fileContent.textContent = 'Ошибка при парсинге YAML.';
            }
        };
        reader.readAsText(file);
    }








    function extractAndCalculateOperations(text) {
        const operations = [];
        
        // Регулярное выражение для поиска арифметических операций с дробными числами, учитая точку и запятую
        const regex = /(\d+[\.,]?\d*)\s*([+\-*/])\s*(\d+[\.,]?\d*)/g;
        let match;
    
        // Ищем все арифметические операции в тексте
        while ((match = regex.exec(text)) !== null) {
            let num1 = match[1].replace(',', '.'); // Заменяем запятую на точку
            let num2 = match[3].replace(',', '.'); // Заменяем запятую на точку
            const operator = match[2];
    
            // Преобразуем в числа
            num1 = parseFloat(num1);
            num2 = parseFloat(num2);
            let result;
    
            // Выполняем операцию
            switch (operator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    result = num2 !== 0 ? num1 / num2 : 'Ошибка (деление на 0)';
                    break;
                default:
                    result = 'Ошибка';
            }
    
            operations.push(`${match[1]} ${operator} ${match[3]} = ${result}`);
        }
      // Если не было найдено операций, возвращаем сообщение
      if (operations.length === 0) {
        return `Арифметические операции не были найдены в файле ${fileName}`;
    }
        return operations.join('\n');
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
