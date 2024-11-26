window.addEventListener("load", function() {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    setTimeout(function() {
        preloader.style.display = "none"; // Скрыть прелоадер
        content.style.display = "block";  // Показать контент
    }, 3000); // Ожидание 3 секунды (можно изменить)
});
