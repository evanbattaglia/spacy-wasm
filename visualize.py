import micropip
from pyodide import to_js

PACKAGES_PATH = "./packages"
CUSTOM_BUILT_PKG_NAMES = [
        f"{PACKAGES_PATH}/langcodes-3.3.0-py3-none-any.modified.whl",
        f"{PACKAGES_PATH}/urllib3-2.2.0-py3-none-any.modified.whl",
]+ list(map(lambda name: f"{PACKAGES_PATH}/{name}-cp310-cp310-emscripten_3_1_14_wasm32.whl", [
    "blis-0.7.8",
    "cymem-2.0.6",
    "murmurhash-1.0.7",
    "preshed-3.0.6",
    "srsly-2.4.3",
    "thinc-8.1.0",
    "spacy-3.4.0",
])) 
SPACY_MODEL_NAME = "fr_core_news_md"
SPACY_MODEL_VERSION = "3.4.0"


# flake8: noqa
await micropip.install([
        f"{PACKAGES_PATH}/{SPACY_MODEL_NAME}-{SPACY_MODEL_VERSION}-py3-none-any.whl"
    ] + CUSTOM_BUILT_PKG_NAMES)  # type: ignore

print("Loading spacy model...")
import spacy
from spacy import displacy

nlp = spacy.load(SPACY_MODEL_NAME)

def visualize(text):
    doc = [token.lemma_ for token in nlp(text)]

    # print("Visualizing...")
    # render = displacy.render(doc, style="ent")

    return to_js(doc)

# Return the visualize function to JS
visualize # type: ignore
