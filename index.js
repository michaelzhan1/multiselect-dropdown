// globals
const dropdownHeight = 20;
const dropdownCount = 5;

// set styles
const style = document.createElement("style");
style.setAttribute("id", "multiselect-dropdown-styles");
style.innerHTML = `
  .dropdown-source {
    background-color: lightgray;
  }

  .dropdown-source-text {
    color: gray;
  }

  .dropdown-selected-list-container {
    width: 100%;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
  }

  .dropdown-selected-list-element {
    color: white;
    background-color: red;
    font-size: 0.75rem;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-left: 0.25rem;
  }

  .dropdown-container {
    position: absolute;
    background-color: blue;
    display: none;
    overflow-y: auto;
  }

  .dropdown-container::-webkit-scrollbar {
    width: 1rem;
    background-color: transparent;
  }

  .dropdown-container::-webkit-scrollbar-thumb {
    background-color: rgb(163, 163, 163);
    border-radius: 0.5rem;
    border: 4px solid transparent;
    background-clip: content-box;
  }

  .dropdown-container::-webkit-scrollbar-thumb:hover {
    background-color: rgb(128, 128, 128);
  }

  .dropdown-container::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .dropdown-option {
    width: 100%;
    height: 20px;
    background-color: white;
    cursor: default;
  }

  .dropdown-option:hover {
    background-color: lightgray;
  }
`
document.head.appendChild(style);

function createDropdown(select) {
  // create dropdown source
  const dropdownSource = document.createElement("div");
  const dropdownSourceText = document.createElement("div");
  const dropdownSelectedList = document.createElement("div");

  dropdownSourceText.textContent = select.getAttribute("text") !== null ? select.getAttribute("text") : "Select an option";
  dropdownSourceText.classList.add("dropdown-source-text");
  dropdownSelectedList.classList.add("dropdown-selected-list-container");

  dropdownSource.appendChild(dropdownSourceText);
  dropdownSource.appendChild(dropdownSelectedList);

  dropdownSource.classList.add("dropdown-source");
  dropdownSource.style.width = select.style.width;
  select.insertAdjacentElement("afterend", dropdownSource);

  // create dropdown container
  const dropdownContainer = document.createElement("div");
  dropdownContainer.classList.add("dropdown-container");
  dropdownContainer.setAttribute("style", `
    width: ${select.style.width};
    height: ${dropdownHeight * Math.min(select.options.length, dropdownCount)}px;
  `);
  dropdownSource.insertAdjacentElement("afterend", dropdownContainer);

  // insert dropdown options and link them to the original select options
  for (let option of select.options) {
    const dropdownOption = document.createElement("div");
    dropdownOption.classList.add("dropdown-option");
    dropdownOption.innerHTML = option.innerHTML;

    dropdownOption.addEventListener("click", () => {
      // toggle selected option and add to dropdown source
      if (select.options[option.index].selected) {
        select.options[option.index].selected = false;
        dropdownOption.style.backgroundColor = "white";

        for (let element of dropdownSelectedList.children) {
          if (element.value === option.value) {
            dropdownSelectedList.removeChild(element);
            if (dropdownSelectedList.childElementCount === 0) {
              dropdownSourceText.style.display = "block";
            }
            break;
          }
        }
      } else {
        select.options[option.index].selected = true;
        dropdownOption.style.backgroundColor = "blue";

        if (dropdownSelectedList.childElementCount === 0) {
          dropdownSourceText.style.display = "none";
        }

        // make box with selected option and x button
        const listElement = document.createElement("div");
        const listElementText = document.createElement("span");
        const listElementButton = document.createElement("button");

        listElementText.textContent = option.textContent;
        listElementButton.textContent = "x";
        listElementButton.addEventListener("click", (event) => {
          select.options[option.index].selected = false;
          dropdownOption.style.backgroundColor = "white";
          dropdownSelectedList.removeChild(listElement);
          if (dropdownSelectedList.childElementCount === 0) {
            dropdownSourceText.style.display = "block";
          }
          event.stopPropagation();
        });

        listElement.classList.add("dropdown-selected-list-element");
        listElement.value = option.value;
        listElement.appendChild(listElementText);
        listElement.appendChild(listElementButton);
        dropdownSelectedList.appendChild(listElement);
      }
    });

    dropdownContainer.appendChild(dropdownOption);
  }

  // toggle dropdown container on click
  dropdownSource.addEventListener("click", (event) => {
    if (dropdownContainer.style.display === "block") {
      dropdownContainer.style.display = "none";
    } else {
      dropdownContainer.style.display = "block";
    }
    event.stopPropagation();
  });

  // close dropdown container on click outside anything non-dropdown related
  document.addEventListener("click", (event) => {
    if (!dropdownContainer.contains(event.target)) {
      dropdownContainer.style.display = "none";
    }
  });
  dropdownContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });
};


// turn select into a drop down
const select = document.getElementById("select");
select.style.display = "none"; // hide the original select element
createDropdown(select);

// submit function just to check output
function handleSubmit(event) {
  event.preventDefault();

  const selectData = select.selectedOptions;
  const selectValues = [];
  for (let option of selectData) {
    selectValues.push(option.value);
  }
  console.log(selectValues);
}

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);
