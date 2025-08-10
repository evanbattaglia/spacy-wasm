async function loadPackages(pyodide) {
  await pyodide.loadPackage(["micropip", "numpy", "pydantic"]);
}

async function loadLemmatize(pyodide) {
  let python_script = await fetch("./lemmatize.py").then((r) => r.text());

  return await pyodide.runPythonAsync(python_script);
}

async function main() {
  let pyodide = await loadPyodide();
  await loadPackages(pyodide);
  // Load lemmatize function
  vis_fn = await loadLemmatize(pyodide);
  // set up postmessage listener:
  window.addEventListener("message", async (event) => {
    if (event.data.type === "lemmatize") {
      // Call the lemmatize function with the input data
      let input = event.data.input;
      let json = vis_fn(input);
      // Send the result back to the parent window
      window.parent.postMessage({ type: "result", data: json }, "*");
    }
  });
}

main();
