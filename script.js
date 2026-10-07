const STORAGE_KEY = "ideabox_ideas";

const ideaForm = document.getElementById("ideaForm");
const ideaInput = document.getElementById("ideaInput");
const ideasList = document.getElementById("ideasList");
const emptyState = document.getElementById("emptyState");

const totalIdeas = document.getElementById("totalIdeas");
const completedIdeas = document.getElementById("completedIdeas");
const activeIdeas = document.getElementById("activeIdeas");

const clearCompletedButton = document.getElementById("clearCompleted");

let ideas = loadIdeas();

function loadIdeas() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Errore nel caricamento delle idee:", error);
    return [];
  }
}

function saveIdeas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function createIdea(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function addIdea(text) {
  const cleanText = text.trim();

  if (!cleanText) {
    return;
  }

  ideas.unshift(createIdea(cleanText));

  saveIdeas();
  render();

  ideaInput.value = "";
  ideaInput.focus();
}

function toggleIdea(id) {
  ideas = ideas.map((idea) => {
    if (idea.id === id) {
      return {
        ...idea,
        completed: !idea.completed
      };
    }

    return idea;
  });

  saveIdeas();
  render();
}

function deleteIdea(id) {
  ideas = ideas.filter((idea) => idea.id !== id);

  saveIdeas();
  render();
}

function clearCompleted() {
  ideas = ideas.filter((idea) => !idea.completed);

  saveIdeas();
  render();
}

function render() {
  const completed = ideas.filter((idea) => idea.completed).length;
  const active = ideas.length - completed;

  totalIdeas.textContent = ideas.length;
  completedIdeas.textContent = completed;
  activeIdeas.textContent = active;

  emptyState.style.display = ideas.length === 0 ? "block" : "none";

  ideasList.innerHTML = "";

  ideas.forEach((idea) => {
    const article = document.createElement("article");

    article.className = `idea ${
      idea.completed ? "completed" : ""
    }`;

    const checkbox = document.createElement("button");

    checkbox.className = `checkbox ${
      idea.completed ? "checked" : ""
    }`;

    checkbox.type = "button";
    checkbox.setAttribute(
      "aria-label",
      idea.completed
        ? "Segna come non completata"
        : "Segna come completata"
    );

    checkbox.innerHTML = idea.completed ? "✓" : "";

    checkbox.addEventListener("click", () => {
      toggleIdea(idea.id);
    });

    const content = document.createElement("div");
    content.className = "idea-content";

    const text = document.createElement("div");
    text.className = "idea-text";
    text.textContent = idea.text;

    const date = document.createElement("div");
    date.className = "idea-date";
    date.textContent = formatDate(idea.createdAt);

    content.appendChild(text);
    content.appendChild(date);

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Elimina idea");
    deleteButton.textContent = "✕";

    deleteButton.addEventListener("click", () => {
      deleteIdea(idea.id);
    });

    article.appendChild(checkbox);
    article.appendChild(content);
    article.appendChild(deleteButton);

    ideasList.appendChild(article);
  });
}

ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addIdea(ideaInput.value);
});

clearCompletedButton.addEventListener("click", clearCompleted);

render();
