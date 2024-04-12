function updateRules() {
  chrome.storage.sync.get({ domains: [] }, function (data) {
    console.log(data.domains);
    let storedDomains = data.domains;
    let newRules = [];
    storedDomains.forEach(function (domain, index) {
      newRules.push({
        id: index + 1,
        priority: 1,
        condition: {
          urlFilter: "*://*" + domain + "/*",
          resourceTypes: ["main_frame"],
        },
        action: {
          type: "block",
        },
      });
    });

    chrome.declarativeNetRequest.getDynamicRules((previousRules) => {
      const previousRuleIds = previousRules.map((rule) => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: previousRuleIds,
        addRules: newRules,
      });
    });
  });
}

// Call updateRules when the extension is loaded
updateRules();

// Call updateRules when a new domain is added
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (changes.domains) {
    updateRules();
  }
});
