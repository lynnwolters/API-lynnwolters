var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FilterFunction {
  constructor() {
    __publicField(this, "init", () => {
      this.bindEvents();
      this.bindDocumentClick();
    });
    __publicField(this, "bindEvents", () => {
      this.filterButtonCategory.addEventListener("click", () => this.toggleFilterFunction("filter-category", "filter-rich-in"));
      this.filterButtonRichIn.addEventListener("click", () => this.toggleFilterFunction("filter-rich-in", "filter-category"));
    });
    __publicField(this, "toggleFilterFunction", (filterToOpen, filterToClose) => {
      const filterToOpenElem = document.getElementById(filterToOpen);
      const filterToCloseElem = document.getElementById(filterToClose);
      if (filterToCloseElem.classList.contains("open")) {
        filterToCloseElem.classList.remove("open");
      }
      filterToOpenElem.classList.toggle("open");
    });
    __publicField(this, "bindDocumentClick", () => {
      document.addEventListener("click", (event) => {
        const isFilterButtonCategoryClicked = event.target === this.filterButtonCategory;
        const isFilterButtonRichInClicked = event.target === this.filterButtonRichIn;
        if (!isFilterButtonCategoryClicked && !isFilterButtonRichInClicked) {
          this.closeFilters();
        }
      });
    });
    __publicField(this, "closeFilters", () => {
      const filtersToClose = [this.filterCategory, this.filterRichIn];
      filtersToClose.forEach((filter) => {
        if (filter.classList.contains("open")) {
          filter.classList.remove("open");
        }
      });
    });
    this.filterButtonCategory = document.getElementById("filter-button-category");
    if (!this.filterButtonCategory) {
      return false;
    }
    this.filterButtonRichIn = document.getElementById("filter-button-rich-in");
    this.filterCategory = document.getElementById("filter-category");
    this.filterRichIn = document.getElementById("filter-rich-in");
    this.init();
  }
}
class DeleteFunction {
  constructor() {
    __publicField(this, "init", () => {
      this.bindEvents();
    });
    __publicField(this, "bindEvents", () => {
      this.deleteButton.addEventListener("click", this.toggleDeleteFunction);
    });
    __publicField(this, "toggleDeleteFunction", () => {
      let selectAllButton = document.getElementById("select-all-button");
      selectAllButton.classList.toggle("open");
    });
    this.deleteButton = document.getElementById("delete-button");
    if (!this.deleteButton) {
      return false;
    }
    this.init();
  }
}
class App {
  constructor() {
    __publicField(this, "init", () => {
      this.filterFunction = new FilterFunction();
      this.deleteFunction = new DeleteFunction();
    });
    this.init();
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
