import "@src/scss/main.scss"

import Filter from "/js/modules/filters";

window.addEventListener("DOMContentLoaded", () => {
    let filterControls = document.querySelector(".js-filter-controls");
    let filterItems = document.querySelector(".js-filter-items");
    if (filterControls && filterItems) {
        new Filter(filterControls, filterItems);
    }
});

