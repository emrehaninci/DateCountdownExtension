let addDateButton = document.getElementById("add-date-button")
let cancelButton = document.getElementById("cancel-button")
let addDateContainer = document.getElementById("add-date-container")
let blurOverlay = document.getElementById("blur-overlay")
let inputTitle = document.getElementById("input-title")
let inputDesc = document.getElementById("input-desc")
let inputDate = document.getElementById("input-date")
let widgetArea = document.getElementById("widget-area")
let deleteButton = document.querySelector(".delete-button")


let isAddOverlayActive = false
let isSplashShowed = false

let dateWidgetList = []

// Delete Button click function updated because of Chrome extension security policy (inline scripts not allowed)
document.addEventListener('click', function (e) {
    if (hasClass(e.target, 'delete-button')) {
        // .bu clicked
        deleteWidget()
    } 
}, false);

function deleteWidget(){
    console.log("clicked")
    const deleteButtonEvent = event.target
    let widgetsFromLocalStorage = JSON.parse(localStorage.getItem("dateWidgetList"))
    let idToDelete = deleteButtonEvent.id

    dateWidgetList = widgetsFromLocalStorage.filter(function(item) {
        console.log("itemid" + item.id)
        console.log("id2de" + idToDelete)
        return item.id != idToDelete
    })

    localStorage.setItem("dateWidgetList", JSON.stringify(dateWidgetList))

    location.reload()
}

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

addDateButton.addEventListener("click", function(){
    if(isAddOverlayActive){
        addNewDate()
        renderWidget()
        closeOverlay()
    } else{
        openOverlay()
    }
})

cancelButton.addEventListener("click", function(){
    closeOverlay()
})


function addNewDate(){
    let dateWidget = {
        title: inputTitle.value,
        description: inputDesc.value,
        date: inputDate.value,
        id: dateWidgetList.length
    }

    dateWidgetList.push(dateWidget)
    // Save Date Widgets to local storage
    localStorage.setItem("dateWidgetList", JSON.stringify(dateWidgetList))

}

function openOverlay(){
    // Open Add New Date Overlay
    addDateContainer.style.display = "block"
    blurOverlay.style.display = "block"
    addDateButton.innerText = "✓"
    isAddOverlayActive = true
}

function closeOverlay(){
    // Close Add New Date Overlay
    addDateContainer.style.display = "none"
    blurOverlay.style.display = "none"
    addDateButton.innerText = "+"
    isAddOverlayActive = false
}

function renderWidget(){

    let widgetsFromLocalStorage = JSON.parse(localStorage.getItem("dateWidgetList"))

    // To add widget immediately after click add button
    let widgetCounter = 0
    if(dateWidgetList.length > 0){
        widgetCounter = dateWidgetList.length - 1
    }

    if(widgetsFromLocalStorage){
        dateWidgetList = widgetsFromLocalStorage

        for(let i=widgetCounter; i < dateWidgetList.length; i++){
            let tempWidget = document.querySelector("div[data-type='widget-template']").cloneNode(true)
            tempWidget.style.display = "grid"
            
            console.log(dateWidgetList[i].title)
            tempWidget.querySelector("#widget-title").textContent = dateWidgetList[i].title + " - " + dateWidgetList[i].date
            tempWidget.querySelector("#widget-description").textContent = dateWidgetList[i].description

            let remainingDays = calculateRemainingDays(dateWidgetList[i].date)
            tempWidget.querySelector("#widget-date-number").textContent = remainingDays
            
            // Color Adjustments
            let colorCode = getColorCode(remainingDays)
            tempWidget.style.borderColor = colorCode
            tempWidget.querySelector("#widget-date-number").style.color = colorCode
            
            tempWidget.querySelector(".delete-button").id = dateWidgetList[i].id
            widgetArea.appendChild(tempWidget)

            
        }
    }
}

function calculateRemainingDays(theDate){
    let currentDate = new Date()
    let userDate = new Date(theDate)

    let differenceMS = userDate.getTime() - currentDate.getTime()
    return differenceDays = Math.ceil(differenceMS / (86400000)) // 86.400.000 = 1000 * 3600 * 24
}

function getColorCode(number){
    if (number <= 7){
        return "#FF7A7B"
    } else if(number > 7 && number <= 30){
        return "#FDD563"
    } else {
        return "#8BE38B"
    }
}

function showSplash(){
    isSplashShowed = JSON.parse(localStorage.getItem("isSplashShowed"))
    if(!isSplashShowed){
        window.location.href = 'splash.html';
    }
}

showSplash()
renderWidget()