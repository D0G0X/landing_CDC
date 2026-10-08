import React from "react"

import ReactDOM from "react-dom/client"

import App from "./App"

import "./index.css"
import "./components/uleam-sections.css"
import "./landing.css"

const VirtualTour = React.lazy(() =>
  import("./components/virtual-tour").then((module) => ({
    default: module.VirtualTour,
  })),
)
const isTourPage = window.location.pathname
  .replace(/\/$/, "")
  .endsWith("/experiencia-360")

if (isTourPage)
  document.title = "Experiencia 360° | Centro de Convenciones ULEAM"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isTourPage ? (
      <React.Suspense
        fallback={
          <main className="tour-page grid place-items-center" role="status">
            Preparando tu visita…
          </main>
        }
      >
        <VirtualTour />
      </React.Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
