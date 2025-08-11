async function loadPackages(pyodide) {
  await pyodide.loadPackage(["micropip", "numpy", "pydantic"]);
}

async function loadLemmatize(pyodide) {
  let python_script = await fetch("./lemmatizer.py").then((r) => r.text());

  return await pyodide.runPythonAsync(python_script);
}

async function main() {
  try {
    document.getElementById("status-emoji").innerHTML = "⏳"; // 🏁
    let pyodide = await loadPyodide();
    await loadPackages(pyodide);
    // Load lemmatize function
    vis_fn = await loadLemmatize(pyodide);
    document.getElementById("status-emoji").innerHTML = "✨"; // 🏁
    // set up postmessage listener:
    window.addEventListener("message", async (event) => {
      if (event.data.type === "lemmatize") {
        const messageId = event.data.messageId;
        // Call the lemmatize function with the input data
        const results = event.data.texts.map(input => {
          try {
            return {ok: vis_fn(input)};
          } catch (e) {
            return {err: e.toString()};
          }
        });
        // Send the result back to the parent window
        window.parent.postMessage({ type: "lemmatizeResult", messageId, results }, "*");
      }
    });
  } catch (error) {
    console.error("Error loading Pyodide or lemmatize function:", error);
    document.getElementById("status-emoji").innerHTML = "⚠️";
    throw error;
  }
}

main();
