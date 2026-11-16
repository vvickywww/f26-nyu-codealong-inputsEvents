# Code-Along: Search as You Type

Last week, the Feedback Tip Library learned to draw itself from the state. A click changed `selectedCategory`, and `render()` redrew the page.

So far, every change to the state has come from a **click**. Today the state will change as the learner **types** in a search box. The good news is that `render()` doesn't care what kind of event happened. The pattern is the same:

> **Any event → change the state → `render()`**

---

## What's new today, and what isn't

Almost all of `script.js` is already written using patterns you know from last week. You'll fill in **three spots marked `NEW`**, about 8 lines in total.

| Already written (we'll review it together) | New today (we'll write it slowly) |
|---|---|
| `selectedCategory` and `searchText`, the two pieces of state | **NEW 1:** listening for typing with the `input` event |
| `render()`: clear the list, loop over the tips, build the cards | **NEW 1:** the `event` object, and reading what was typed |
| The count and the "No tips match" message | **NEW 2:** a function that takes a tip and **returns** `true` or `false` |
| The filter buttons and `localStorage` | **NEW 3:** using that answer in the `if` inside `render()` |

---

## Files

- `index.html`: the page. The search box is already there, but nothing is listening to it yet.
- `script.js`: **start here.** Read it first, then fill in the three `NEW` spots.
- `completed-script.js`: the finished version. Check against it after class, not before.
- `style.css`: styles for the cards, buttons, search box, and the "No tips match" message.

---

## Step 0: Code review

Before writing anything, read `script.js` from top to bottom and answer these:

1. Where is the state? There are two variables. What does each one remember?
2. Find the **one place** that draws the page.
3. Why is the click handler only three lines long?
4. Find the "No tips match" message. When will it show up?
5. Type in the search box. Nothing happens. **Why not?** What's missing?

---

## NEW 1: Listen for typing

```js
searchInput.addEventListener("input", (event) => {
  searchText = event.target.value;
  render();
});
```

### What each line does

**`searchInput.addEventListener("input", …)`**
This tells the browser: *"Whenever an `input` event happens on the search box, run this function."*

This line runs **once**, when the page loads. It doesn't search anything. It sets up a listener and waits.

The `input` event fires on **every change** to the box:
- typing a letter
- deleting a letter
- clearing the box with the ✕

**`(event) => { … }`**
This is the function the browser calls each time the box changes. The browser passes it an **`event` object**, which describes what just happened.

> 💡 Your click handlers got an `event` object too. We just never needed it before.

**`searchText = event.target.value;`**
- `event.target` is the element the event happened on, which is the search box.
- `.value` is the **full text** in the box right now, not just the last letter.

So the state now remembers exactly what the learner sees in the box.

**`render();`**
The state changed, so redraw the page from it. This is the same rule as last week.

### Try it in three steps

Don't type the whole thing at once. Build it up and look at the Console each time:

1. Put `console.log(event);` inside the function. Type one letter, then open the object in the Console and find `target`.
2. Change it to `console.log(event.target.value);`. Type slowly, then delete. Every keystroke prints the full text.
3. Replace the log with the two real lines: set `searchText`, then call `render()`.

> ❓ **Why does typing still not change the page?** `render()` doesn't look at `searchText` yet. NEW 1 *writes* the state, but nothing *reads* it. That's the job of NEW 2 and NEW 3.

### Why redraw on every keystroke?

- **The page has to match the state.** If `searchText` changes from `"wor"` to `"work"` and we don't redraw, the box says one thing and the cards show results for another.
- **`render()` starts from blank every time.** It doesn't try to work out *what changed*. It clears the list and draws whatever the state says. That's why typing and deleting fast never leaves duplicate or missing cards.
- **Isn't that a lot of work?** For 6 tips, redrawing takes much less time than a keystroke. You won't notice it.

---

## NEW 2: A function that answers a question

```js
function matchesSearch(tip) {
  const text = (tip.title + " " + tip.description).toLowerCase();
  return text.includes(searchText.toLowerCase());
}
```

This function answers one question: **"Does this tip contain the search text?"**

- **`tip` is a parameter.** It's a blank that gets filled in each time the function is called. `matchesSearch(tips[0])` fills it with the first tip.
- **`return` hands an answer back** to whoever asked. Here the answer is always `true` or `false`.
- **`toLowerCase()` on both sides** means `Work`, `WORK`, and `work` all match. Without it, `includes` treats capital letters as different.
- **Title + description** means a search for `example` still finds "Be specific", because the word is in its description.

> 💡 `render()` **does** something: it draws the page. `matchesSearch()` **answers** something: true or false. A good name for an answering function is a question.

### Test it in the Console before you use it

Save, refresh, type `spec` in the search box, then type this in the Console:

```js
matchesSearch(tips[0])   // "Be specific" → true
matchesSearch(tips[1])   // "Quote their words" → false
```

If you get "not defined", save and refresh first.

---

## NEW 3: Connect it

Inside the loop in `render()`, change the `if` so it asks both questions:

```js
if ((selectedCategory === "all" || tip.category === selectedCategory) && matchesSearch(tip)) {
```

Read it out loud: *"If the tip is in the selected category **and** it matches the search, draw it."* Both questions have to say yes.

Now type `work`. The cards change as you type. Type `zebra`, and the "No tips match" message appears. You didn't write any new code for that message. It was already in `render()`, and that's the payoff of drawing everything in one place.

---

## How it all connects

### When the page loads

The browser runs `script.js` once, from top to bottom:

1. `let searchText = "";` creates the state. It's outside any function, so the whole file can read and change it.
2. `searchInput` finds the search box in `index.html`.
3. `matchesSearch()` and `render()` are **defined**, but they don't run yet.
4. The listeners are attached (NEW 1, and the click handlers).
5. `render();` at the bottom draws the starting page. `searchText` is `""`, and every tip contains `""`, so all the tips show.

Then the script **stops and waits**. Nothing else runs until the learner does something.

### Every time the learner types a letter

```
learner types "k"
  → the browser fires "input" and calls the NEW 1 function
    → searchText = "work"                  (the state changes)
    → render()
        → clear the list
        → loop over the tips
            → if (... && matchesSearch(tip))      (NEW 3)
                → matchesSearch reads searchText
                  and returns true or false       (NEW 2)
        → update the count and the "No tips match" message
  → the page now matches "work"
```

### The three NEW spots, together

| Spot | Its job |
|---|---|
| **NEW 1** | **writes** the state when the learner types |
| **NEW 2** | **reads** the state and answers "does this tip match?" |
| **NEW 3** | **uses** that answer to decide what gets drawn |

NEW 1 never touches the cards. It only changes `searchText`. Drawing the page is always `render()`'s job.

> **Change the state in one place. Draw the page in one place.**

---

## Break it on purpose

- Type `one`, then click every category. Do the count and the cards always agree?
- Type and delete letters quickly. Does anything duplicate?
- Clear the box with the ✕. Do all the tips come back?
- Refresh the page. The category is remembered, but the search isn't. Why? Is that the right choice for a learner?

## Common mistakes

| What you see | Likely cause |
|---|---|
| Typing does nothing, and the Console is quiet | `"input"` is misspelled, or the listener is on the wrong element. Add `console.log(event)` to check that it fires. |
| Typing logs the text, but the cards don't change | NEW 3 isn't done yet, so `render()` isn't reading `searchText`. |
| No cards show, ever | `matchesSearch` is missing `return`, so it gives back `undefined`, which counts as false. |
| `Work` finds nothing, but `work` does | `toLowerCase()` is missing on one side. |
| "matchesSearch is not defined" in the Console | Save and refresh the page first. |

---

## Try it in your project

Answer these in your Project Log:

1. Which user story could use something other than a click? For example typing, choosing from a `<select>`, checking a box, or submitting a form.
2. What would the state be, and what does it start at?
3. Is there a long `if` in your `render()` that could become a function named as a question?
