$(document).ready(function () {
    localStorage.setItem("toggleArticles", false);

    console.log(window.location.pathname);
    if (window.location.pathname === '/scrape') {
        console.log("home");

        setTimeout(function () {
            window.location.pathname = '/';
        }, 3000);
    }
});