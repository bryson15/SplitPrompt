const selectedOption = document.getElementById("selected-option");
const unselectedOptions = document.querySelectorAll(".unselected-option");
const chunkInput = document.getElementById("chunkInput");

const savedOption = localStorage.getItem("savedOption") || "GPT-3.5";
const customChunk = localStorage.getItem("customChunk") || "";

selectedOption.innerText = savedOption;
updateUnselectedOptions(savedOption);
chunkInput.value = getChunkValue(savedOption);

selectedOption.addEventListener("click", function(event) {
    if (unselectedOptions[0].style.display === "block") {
        toggleUnselectedOptions("none");
    } else {
        toggleUnselectedOptions("block");
    }
    event.stopPropagation();
});


document.addEventListener("click", function() {
    toggleUnselectedOptions("none");
});

unselectedOptions.forEach(option => {
    option.addEventListener("click", function(event) {
        const newSelected = event.target.innerText;
        updateUnselectedOptions(newSelected);
        localStorage.setItem("savedOption", newSelected);
        chunkInput.value = getChunkValue(newSelected);
        if (newSelected === "CUSTOM") {
            chunkInput.focus();
        }
        handleOutput();
    });
});

chunkInput.addEventListener("input", function() {
    const inputValue = chunkInput.value.replace(/^0+/, '') || "";
    localStorage.setItem("savedOption", "CUSTOM");
    localStorage.setItem("customChunk", inputValue);
    selectedOption.innerText = "CUSTOM";
    updateUnselectedOptions("CUSTOM");

    handleOutput();
});

function isClickInsideElement(target, element) {
    return element.contains(target);
}
chunkInput.addEventListener("blur", function(event) {
    const handleDefault = (event) => {
        const inputValue = chunkInput.value.trim();
        if ((!inputValue || isNaN(inputValue) || parseInt(inputValue) <= 0)) {
            if (event.relatedTarget && ["GPT-3.5", "GPT-4", "CUSTOM"].indexOf(event.relatedTarget.innerText) !== -1) {
                setTimeout(event.relatedTarget.addEventListener("blur", handleDefault, { once: true }), 0);
                return;
            } else {
                localStorage.setItem("savedOption", "GPT-3.5");
                selectedOption.innerText = "GPT-3.5";
                updateUnselectedOptions("GPT-3.5");
                chunkInput.value = getChunkValue("GPT-3.5");
            }            
        }
    };
    setTimeout(handleDefault(event), 0);
});


function toggleUnselectedOptions(display) {
    unselectedOptions.forEach(option => {
        option.style.display = display;
    });
}

function updateUnselectedOptions(newSelected) {
    const options = ["GPT-3.5", "GPT-4", "CUSTOM"];
    const unselected = options.filter(opt => opt !== newSelected);
    unselectedOptions.forEach((option, i) => {
        option.innerText = unselected[i];
        localStorage.setItem(`otherOption${i + 1}`, unselected[i]);
    });
    selectedOption.innerText = newSelected;
}

function getChunkValue(option) {
    switch (option) {
        case "GPT-3.5":
            return 3000; // 16372
        case "GPT-4":
            return 2500; // 8170
        case "CUSTOM":
            return localStorage.getItem("customChunk") || "";
        default:
            return "";
    }
}
