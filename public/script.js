function ResourceItem({ name, length }) {
  if (name === "protected_resources") return;

  return `
      <li>
        <a href="${name}">/${name}</a>
        <sup>${length ? `${length}x` : "object"}</sup>
      </li>
    `;
}

function ResourceList({ db }) {
  return `
      <ul>
        ${Object.keys(db)
          .map((name) =>
            ResourceItem({
              name,
              length: Array.isArray(db[name]) && db[name].length,
            })
          )
          .join("")}
      </ul>
    `;
}

function NoResources() {
  return `<p>No resources found</p>`;
}

function ResourcesBlock({ db }) {
  return `
      <div>
        <h1>Resources</h1>
        ${Object.keys(db).length ? ResourceList({ db }) : NoResources()}
      </div>
    `;
}

window
  .fetch("db")
  .then((response) => response.json())
  .then(
    (db) =>
      (document.getElementById("resources").innerHTML = ResourcesBlock({ db }))
  );
