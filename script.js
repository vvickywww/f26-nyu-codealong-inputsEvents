// The lesson content (same tips as last week)
const tips = [
  {
    title: "Be specific",
    description:
      'Point to one exact moment in the work. "The second example made this click" helps more than "Nice job."',
    category: "specific",
  },
  {
    title: "Quote their words",
    description:
      "Repeat the exact sentence you're responding to, so they know which part you mean.",
    category: "specific",
  },
  {
    title: "Focus on the work",
    description:
      'Describe what the work does, not who the person is. "This paragraph buries the main idea" gives them something to change.',
    category: "kind",
  },
  {
    title: "Start with what works",
    description:
      "Name one thing that's already working before you name what isn't. It tells them what to keep.",
    category: "kind",
  },
  {
    title: "Suggest a next step",
    description:
      'Finish with one action they can take. "Try opening with your conclusion" tells them where to start.',
    category: "actionable",
  },
  {
    title: "Pick one thing",
    description:
      "Give the most important change first. Five suggestions at once usually means none get made.",
    category: "actionable",
  },
];

// ============================================================
// CODE REVIEW: read this file before writing anything.
// Everything here uses patterns from last week. Only the two
// "NEW" spots are empty, plus one line we'll change in render().
// ============================================================

// STATE 1: which category the learner picked. Saved, so a refresh keeps it.
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// STATE 2: what the learner has typed in the search box. Starts empty.
// Nothing changes it yet, and render() doesn't read it yet.
let searchText = "";

// Find the elements on the page
const tipList = document.getElementById("tip-list");
const count = document.getElementById("count");
const filterButtons = document.querySelectorAll(".filter-button");
const searchInput = document.getElementById("search");

// NEW 2: A function that answers "does this tip match the search?"


// render() draws the tip cards, the count, the empty message, and the selected button from the state
function render() {
  // Clear the old cards, so we don't add duplicates
  tipList.innerHTML = "";

  let shown = 0;

  tips.forEach((tip) => {
    // NEW 3: This if only asks about the category. Make it ask about the search too.
    if (selectedCategory === "all" || tip.category === selectedCategory) {
      const card = document.createElement("article");
      card.classList.add("tip");

      const tag = document.createElement("span");
      tag.classList.add("tip-tag");
      tag.textContent = tip.category;

      const title = document.createElement("h2");
      title.textContent = tip.title;

      const description = document.createElement("p");
      description.textContent = tip.description;

      card.appendChild(tag);
      card.appendChild(title);
      card.appendChild(description);
      tipList.appendChild(card);

      shown = shown + 1;
    }
  });

  // If nothing matched, tell the learner what to do next
  if (shown === 0) {
    const empty = document.createElement("p");
    empty.classList.add("empty");
    empty.textContent = "No tips match. Try another word or choose All.";
    tipList.appendChild(empty);
  }

  count.textContent = "Showing " + shown + " of " + tips.length + " tips";

  filterButtons.forEach((button) => {
    if (button.dataset.filter === selectedCategory) {
      button.classList.add("is-selected");
    } else {
      button.classList.remove("is-selected");
    }
  });
}

// One click handler for every filter button: change the state, save it, redraw
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.filter;
    localStorage.setItem("selectedCategory", selectedCategory);
    render();
  });
});

// NEW 1: Listen for typing in the search box


// Draw the page once at the start
render();

// Break it on purpose
// - Type "one", then click every category. Do the count and cards agree?
// - Clear the box with the ✕. Do all the tips come back?
// - Refresh. Which state is remembered, and which isn't? Is that right for a learner?
