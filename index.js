let addDateButton = document.getElementById("add-date-button")
let cancelButton = document.getElementById("cancel-button")
let addDateContainer = document.getElementById("add-date-container")
let blurOverlay = document.getElementById("blur-overlay")
let inputTitle = document.getElementById("input-title")
let inputDesc = document.getElementById("input-desc")
let inputDate = document.getElementById("input-date")
let widgetArea = document.getElementById("widget-area")


let isAddOverlayActive = false

let dateWidgetList = []


addDateButton.addEventListener("click", function(){
    if(isAddOverlayActive){
        addNewDate()
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
        date: inputDate.value
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

    if(widgetsFromLocalStorage){
        dateWidgetList = widgetsFromLocalStorage

        for(let i=0; i < dateWidgetList.length; i++){
            let tempWidget = document.querySelector("div[data-type='widget-template']").cloneNode(true)
            tempWidget.style.display = "grid"
            console.log(dateWidgetList[i].title)
            tempWidget.querySelector("#widget-title").textContent = dateWidgetList[i].title
            tempWidget.querySelector("#widget-description").textContent = dateWidgetList[i].description

            tempWidget.querySelector("#widget-date-number").textContent = dateWidgetList[i].description
            
            widgetArea.appendChild(tempWidget)
        }


    }
}

function calculateRemainDays(){
    
}

renderWidget()