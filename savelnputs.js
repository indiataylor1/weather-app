let historyList = document.createElement("li");

function newInput() {
  searchInputVal = [];
  let inputs = document.getElementById("search-input").value;

  searchInputVal.push(inputs);

  console.log(searchInputVal);
  let inputsJson = JSON.stringify(searchInputVal);
  localStorage.setItem("input", inputsJson);

  let inputText = localStorage.getItem("input");
  console.log(inputText);

  let inputJson = JSON.parse(inputText);

  historyList.setAttribute("class", "list-group-item");
  historyList.innerHTML = inputJson;

  let historyDisplay = document.getElementById("history");
  historyDisplay.appendChild(historyList);

  console.log(inputs);
}

function clearInput() {
  historyList.innerHTML = "";
}
function displayInput() {
  let inputText = localStorage.getItem("input");
  if (!inputText) {
    return;
  } else {
    let inputText = localStorage.getItem("input");
    let inputJson = JSON.parse(inputText);
    historyList.setAttribute("class", "list-group-item");
    historyList.innerHTML = inputJson;

    let historyDisplay = document.getElementById("history");
    historyDisplay.appendChild(historyList);
  }
}

displayInput();

historyList.addEventListener("click", handleSearchFormSubmit);

searchFormEl.addEventListener("submit", newInput);
