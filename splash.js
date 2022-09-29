let getStartedButton = document.getElementById("get-started-button");
let isSplashShowed = true

getStartedButton.addEventListener("click", function(){
    localStorage.setItem("isSplashShowed", JSON.stringify(isSplashShowed))
    window.location.href = 'index.html';
})