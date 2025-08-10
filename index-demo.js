async function loadPackages(pyodide) {
  await pyodide.loadPackage(["micropip", "numpy", "pydantic"]);
}

async function loadLemmatize(pyodide) {
  let python_script = await fetch("./lemmatize.py").then((r) => r.text());

  return await pyodide.runPythonAsync(python_script);
}

async function main() {
  // Set default value for input
  document.getElementById("input").value =
    "Wikipédia est définie par des principes fondateurs. Son contenu est sous licence Creative Commons BY-SA. Il peut être copié et réutilisé sous la même licence, sous réserve d'en respecter les conditions.";

  // Load Pyodide and packages
  let pyodide = await loadPyodide();

  await loadPackages(pyodide);

  // Load lemmatize function
  vis_fn = await loadLemmatize(pyodide);

  // Enable the form button and change label
  document.getElementById("submit").disabled = false;
  document.getElementById("submit").innerHTML = "Lemmatize";

  // Add event listener to form
  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();

    let input = document.getElementById("input").value;

    let json = vis_fn(input);

    document.getElementById("output").innerText = JSON.stringify(json);
  });
}

main();
