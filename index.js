let addDateButton = document.getElementById("add-date-button")
let cancelButton = document.getElementById("cancel-button")
let addDateContainer = document.getElementById("add-date-container")
let blurOverlay = document.getElementById("blur-overlay")
let inputTitle = document.getElementById("input-title")
let inputDesc = document.getElementById("input-desc")
let inputDate = document.getElementById("input-date")
let widgetArea = document.getElementById("widget-area")
let deleteButton = document.querySelector(".delete-button")
let bodyEl = document.getElementsByTagName("BODY")[0]
let checkBox = document.getElementById("sorting-checkbox")
let sortingToolTip = document.getElementById("sorting-tooltip")
const darkModeCbEl = document.getElementById("dark-mode-cb")

let dateWidgetList = []

let isAddOverlayActive = false
let isSplashShowed = false
let isDarkModeEnabled = false

const SortTypes = {
    AddedDate : 0,
    TimeLeft : 1
}

let sortType = SortTypes.TimeLeft

checkBox.addEventListener('change', function() {
    if (this.checked) {
        sortType = SortTypes.TimeLeft
        sortingToolTip.textContent = "Sorted by Closest Date"
    } else {
        sortType = SortTypes.AddedDate
        sortingToolTip.textContent = "Sorted by Creation Date"
    }
    localStorage.setItem("sortType", sortType)
    renderWidget()
  });

// Dark Mode Switch
darkModeCbEl.addEventListener('change', () => {
	if(darkModeCbEl.checked){
        darkModeOn()
        isDarkModeEnabled = true
    } else{
        darkModeOff()
        isDarkModeEnabled = false
    }
    localStorage.setItem("isDarkModeEnabled", isDarkModeEnabled)
});

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
    renderWidget()
}

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

addDateButton.addEventListener("click", function(){
    if(isAddOverlayActive){
        addNewDate()
        renderWidget()
        closeOverlay()
    } 
    else{
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
        id: Date.now()
    }

    dateWidgetList.push(dateWidget)
    // Save Date Widgets to local storage
    localStorage.setItem("dateWidgetList", JSON.stringify(dateWidgetList))
}

function openOverlay(){
    // Open Add New Date Overlay
    bodyEl.style.minHeight = "620px"
    addDateContainer.style.display = "block"
    blurOverlay.style.display = "block"
    addDateButton.innerText = "✓"
    isAddOverlayActive = true
}

function closeOverlay(){
    // Close Add New Date Overlay
    bodyEl.style.minHeight = "290px"

    addDateContainer.style.display = "none"
    blurOverlay.style.display = "none"
    addDateButton.innerText = "+"
    isAddOverlayActive = false
}

function renderWidget(){
    let widgetsFromLocalStorage = JSON.parse(localStorage.getItem("dateWidgetList"))

    // First clear widgets in parent widget except the hidden template
    clearWidgets()

    if(widgetsFromLocalStorage){

        // Change widget array by Sort Type
        if(sortType == SortTypes.TimeLeft){
            dateWidgetList = sortWidgetByTimeLeft(widgetsFromLocalStorage)
        } else {
            dateWidgetList = widgetsFromLocalStorage
        }

        for(let i=0; i < dateWidgetList.length; i++){
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

function sortWidgetByTimeLeft(widgetArray){
    console.log("sorting: " + widgetArray)
    widgetArray.sort((a,b) => {
        return calculateRemainingDays(a.date) - calculateRemainingDays(b.date)
    })

    return widgetArray
}

function showSplash(){
    isSplashShowed = localStorage.getItem("isSplashShowed")
    if(!isSplashShowed){
        window.location.href = 'splash.html';
    }
}

function activateSorting(){
    let sortTypeFromLocalStorage = localStorage.getItem("sortType")

    if(sortTypeFromLocalStorage){
        sortType = sortTypeFromLocalStorage

        if(sortType == SortTypes.AddedDate){
            sortingToolTip.textContent = "Sorted by Creation Date"
            checkBox.checked = false

        } else if (sortType == SortTypes.TimeLeft) {
            sortingToolTip.textContent = "Sorted by Closest Date"
            checkBox.checked = true
        }
    }
}

function clearWidgets(){
    while (widgetArea.childNodes.length > 3) {
        widgetArea.removeChild(widgetArea.lastChild);
    }
}

// Dark Mode Functions
function renderDarkMode(){
    isDarkModeEnabled = localStorage.getItem("isDarkModeEnabled")

    if(isDarkModeEnabled == "true"){
        darkModeCbEl.checked = true
        darkModeOn()
    }
    else{
        darkModeCbEl.checked = false
        darkModeOff()
    }
}

function darkModeOn() {
    document.body.classList.add("dark-mode");
}
  
function darkModeOff() {
    document.body.classList.remove("dark-mode");
}
// Dark Mode Functions

renderDarkMode()
activateSorting()
showSplash()
renderWidget()