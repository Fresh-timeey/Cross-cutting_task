const { handleFiles, renderWord, renderPDF } = require('./script');

describe('handleFiles', () => {
    let fileList;
    let files;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="fileList"></div>
            <div id="text-box"></div>
            <div id="work-area" style="display: none;"></div>
            <button id="upload-btn"></button>
        `;
        fileList = document.getElementById('fileList');
        files = [];
    });

    it('должен добавлять новые файлы в список и обновлять интерфейс', () => {
        const newFiles = [{ name: 'файл1.txt' }, { name: 'файл2.txt' }];
        handleFiles(newFiles);
        
        // Проверка, что новые файлы добавлены в DOM
        expect(fileList.children).toHaveLength(2);
        expect(fileList.children[0].textContent).toBe('файл1.txt');
        expect(fileList.children[1].textContent).toBe('файл2.txt');

        console.log('Тест "handleFiles" пройден успешно!');
    });

    it('должен скрывать текстовое поле и показывать рабочую область, если файлы были выбраны', () => {
        const newFiles = [{ name: 'файл1.txt' }];
        handleFiles(newFiles);

        // Проверка, что рабочая область стала видимой
        const workArea = document.getElementById('work-area');
        expect(workArea.style.display).toBe('flex');

        // Проверка, что кнопка загрузки файлов исчезла
        const uploadBtn = document.getElementById('upload-btn');
        expect(uploadBtn.style.display).toBe('none');

        console.log('Тест "handleFiles" с проверкой скрытия текста и отображения рабочей области пройден успешно!');
    });
});

describe('renderWord', () => {
    let fileContent;

    beforeEach(() => {
        document.body.innerHTML = `<div id="fileContent"></div>`;
        fileContent = document.getElementById('fileContent');
    });

    it('должен корректно извлекать текст из Word файла', async () => {
        const mockFile = new Blob([new ArrayBuffer(8)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

        // Mocking mammoth.extractRawText
        const mockMammoth = jest.fn().mockResolvedValue({ value: 'Тестовый текст' });
        global.mammoth = { extractRawText: mockMammoth };

        await renderWord(mockFile);

        expect(fileContent.textContent).toBe('Тестовый текст');
        expect(mockMammoth).toHaveBeenCalled();

        console.log('Тест "renderWord" с извлечением текста пройден успешно!');
    });

    it('должен выводить ошибку при неудачном извлечении текста из Word файла', async () => {
        const mockFile = new Blob([new ArrayBuffer(8)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

        // Mocking mammoth.extractRawText to reject
        const mockMammoth = jest.fn().mockRejectedValue(new Error('Ошибка'));
        global.mammoth = { extractRawText: mockMammoth };

        await renderWord(mockFile);

        expect(fileContent.textContent).toBe('Не удалось прочитать содержимое Word-файла.');

        console.log('Тест "renderWord" с ошибкой при извлечении текста пройден успешно!');
    });
});

describe('renderPDF', () => {
    let fileContent;

    beforeEach(() => {
        document.body.innerHTML = `<div id="fileContent"></div>`;
        fileContent = document.getElementById('fileContent');
    });

    it('должен корректно извлекать текст из PDF файла', async () => {
        const mockFile = new Blob([new ArrayBuffer(8)], { type: 'application/pdf' });

        // Mocking the pdfjsLib functionality
        const mockPdf = {
            numPages: 1,
            getPage: jest.fn().mockResolvedValue({
                getTextContent: jest.fn().mockResolvedValue({ items: [{ str: 'Тестовый текст' }] })
            })
        };

        const pdfjsLib = {
            getDocument: jest.fn().mockResolvedValue(mockPdf)
        };

        global.pdfjsLib = pdfjsLib;

        await renderPDF(mockFile);

        expect(fileContent.textContent).toBe('Тестовый текст');

        console.log('Тест "renderPDF" с извлечением текста пройден успешно!');
    });

    it('должен выводить ошибку при неудачном извлечении текста из PDF файла', async () => {
        const mockFile = new Blob([new ArrayBuffer(8)], { type: 'application/pdf' });

        // Mocking the pdfjsLib to reject
        const pdfjsLib = {
            getDocument: jest.fn().mockRejectedValue(new Error('Ошибка'))
        };

        global.pdfjsLib = pdfjsLib;

        await renderPDF(mockFile);

        expect(fileContent.textContent).toBe('Ошибка загрузки PDF.');

        console.log('Тест "renderPDF" с ошибкой при извлечении текста пройден успешно!');
    });
});
