import "./style.css";
import { lessons } from "./lessons";
import { renderRoute, renderShell } from "./render";

const root = document.querySelector<HTMLElement>("#app")!;
const view = renderShell(root);

const rerender = () => renderRoute(view, lessons, location.hash);

window.addEventListener("hashchange", rerender);
rerender();
