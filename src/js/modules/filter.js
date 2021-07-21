export default class Filter {
    constructor(controls, items) {
        this.controls = controls.querySelectorAll("[data-filter]");
        this.items = items.querySelectorAll("[data-filter]");
        this.groupButton = document.querySelector(".js-filter-grouping");

        this.init();
    }

    init() {
        this.groupButton.addEventListener("click", (e) => {
            e.preventDefault();

            let parent = this.groupButton.parentElement;
            if(parent.classList.contains("active")) {
                parent.classList.remove("active");
                this.ungroupItems();
            }else{
                parent.classList.add("active");
                this.groupItems();
            }
        });
        this.controls.forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();

                this.toggleFilterButtons(button);

                let controlType = button.getAttribute("data-filter");
                if(controlType == 0) {
                    this.activateAllItems();
                    this.regroupItems();
                    return;
                }
                this.items.forEach((item) => {
                    let itemType = item.getAttribute("data-filter");
                    if(controlType != itemType) {
                        item.classList.add("hidden");
                    }else{
                        item.classList.remove("hidden");
                    }
                });

                this.regroupItems();
            });
        });
    }

    /*Функция переключения кнопок фильтра*/
    toggleFilterButtons(button) {
        this.controls.forEach((item) => {
            item.parentElement.classList.remove("active");
        });
        button.parentElement.classList.add("active");
    }

    /*Функция сброса фильтра*/
    activateAllItems() {
        this.items.forEach((item) => {
            item.classList.remove("hidden");
        });
    }

    /*Функция создания элемента-ограничителя, который будет подставлен при группировке*/
    createYearLine(year) {
        let element = document.createElement("div");
        let span = document.createElement("span");
        span.innerText = year;
        element.classList.add("filter__items-grouping");
        element.classList.add("js-grouping-line");
        element.appendChild(span);

        return element;
    }

    /*Функция группировки элементов фильтра и подставновки элементов-ограничителей (например год)*/
    groupItems() {
        let sortArray = [];
        let parent = this.items[0].parentNode;
        this.items.forEach((item) => {
            sortArray.push(parent.removeChild(item));
        });
        sortArray.sort((nodeA, nodeB) => {
            let yearA = parseInt(nodeA.getAttribute("data-filter-grouping"));
            let yearB = parseInt(nodeB.getAttribute("data-filter-grouping"));

            return yearB - yearA;
        }).forEach((element, index) => {
            let currentElementYear = element.getAttribute("data-filter-grouping");
            let isHidden = element.classList.contains("hidden");
            if(index != 0) {
                let previousElement = sortArray[index - 1];
                let previousElementYear = previousElement.getAttribute("data-filter-grouping");
                if(currentElementYear != previousElementYear && !isHidden) {
                    parent.appendChild(this.createYearLine(currentElementYear));
                }
                parent.appendChild(element);
            }else{
                parent.appendChild(this.createYearLine(currentElementYear));
                parent.appendChild(element);
            }
        });
    }

    /*Функция удаления элемента-ограничителя при переключении фильтра*/
    ungroupItems() {
        document.querySelectorAll(".js-grouping-line").forEach((e) => {
            e.remove()
        });
    }

    /*Функция перегруппировки по годам, если фильтр был изменен*/
    regroupItems() {
        if(this.groupButton.parentElement.classList.contains("active")) {
            this.ungroupItems();
            this.groupItems();
        }
    }
}