# NovaThread Collective Website

Static single-page website for NovaThread Collective, a modern streetwear brand blending sustainability with future-forward design.

## Getting Started

You can view the site directly from the repository or run a lightweight local server:

### Option 1: Open the file directly
1. Locate `index.html` in the project root.
2. Double-click it (or right-click and choose **Open With Browser**) to launch the page in Chrome, Firefox, Safari, or Edge.

### Option 2: Serve the site locally
Running a tiny HTTP server avoids browser restrictions around local fonts or scripts.

#### Using Python
```bash
python3 -m http.server 8080
```
Then visit [http://localhost:8080](http://localhost:8080) in your browser. Press `Ctrl+C` in the terminal to stop the server.

#### Using Node.js (if installed)
```bash
npx http-server . -p 8080
```
Open the same URL in your browser when the server starts.

## Structure

- `index.html` – Landing page markup featuring hero, highlights, materials, services, size guide, shoppable gallery, story, sustainability, lookbook, testimonials, journal, FAQ, newsletter, and checkout sections.
- `assets/css/styles.css` – Global styles, layout, and responsive design for minimalist cards, tables, accordions, page templates, and responsive navigation.
- `assets/js/main.js` – Navigation toggle, color swatch selectors, checkout totals, Payment Request (Apple Pay & cards), FAQ accordion, and dynamic footer year.
- `products/` – Individual product detail pages with imagery, features, and care notes for each item highlighted on the storefront.
- `pages/` – Additional content including the lookbook, shipping & returns, extended size guide, FAQ, and journal features.

## Payments & checkout

The express checkout section supports the browser Payment Request API. On supported devices, shoppers can use Apple Pay or saved cards for a streamlined experience. Browsers that do not support the API fall back to the standard checkout CTA and display an explanatory notice.
