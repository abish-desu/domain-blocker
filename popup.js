document.getElementById("btn").addEventListener("click", function () {
  let domainAddedByUser = document.getElementById("domain").value;

  // If domainAddedByUser is an empty string, show an alert and return
  if (domainAddedByUser === "") {
    alert("Please enter a domain");
    return;
  }

  // Get domains in the chrome storage
  chrome.storage.sync.get({ domains: [] }, function (data) {
    let domainStoredInChrome = data.domains;

    // Push the domain added by user to the array
    domainStoredInChrome.push(domainAddedByUser);

    // Set the new array to the chrome storage
    chrome.storage.sync.set({ domains: domainStoredInChrome }, function () {
      alert(`${domainAddedByUser} added successfully`);
      console.log(domainStoredInChrome);
      document.getElementById("domain").value = "";
    });
  });
});

document.getElementById("show-btn").addEventListener("click", function () {
  chrome.storage.sync.get({ domains: [] }, function (data) {
    let domainStoredInChrome = data.domains;
    console.log(domainStoredInChrome);
    domainStoredInChrome.length === 0 ? alert("No domains stored") : null;
    // Select the HTML element where you want to display the domains
    let displayElement = document.getElementById("display-domains");

    // Clear the display element
    displayElement.innerHTML = "";

    // Create a new element for each domain and append it to the display element
    domainStoredInChrome.forEach(function (domain) {
      let domainElement = document.createElement("p");
      domainElement.textContent = domain;

      // Create a delete button for each domain
      let deleteButton = document.createElement("button");
      deleteButton.id = "clear-btn";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        // Find the index of the domain in the array
        let index = domainStoredInChrome.indexOf(domain);

        // Remove the domain from the array
        if (index !== -1) {
          domainStoredInChrome.splice(index, 1);
        }

        // Update the domains in the chrome storage
        chrome.storage.sync.set({ domains: domainStoredInChrome }, function () {
          alert(`${domain} removed successfully`);

          // Remove the domain element from the display
          displayElement.removeChild(domainElement);
        });
      });

      // Append the delete button to the domain element
      domainElement.appendChild(deleteButton);

      // Append the domain element to the display element
      displayElement.appendChild(domainElement);
    });
  });
});
