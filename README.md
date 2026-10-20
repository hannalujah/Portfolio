# Haniyeh Zahra Budaqi: Portfolio

My personal academic portfolio. It is a static site (plain HTML, CSS and JS with no build step), hosted on GitHub Pages.

## Structure

```
index.html            page layout (rarely needs editing)
data/content.js       ALL the content: profile, publications, projects, experience...
assets/css/style.css  styles (colors are defined at the top as variables)
assets/js/main.js     renders content.js into the page
assets/img/           favicon, profile photo, project images
assets/CV_Haniyeh_Budaqi.pdf   the CV linked from the "CV" button
```

## Adding a project

Open `data/content.js`, find `projects: [`, and paste a new entry into the list:

```js
{
  id: "short-unique-id",            // used in share links: yoursite/#project-short-unique-id
  title: "Project title",
  category: "academic",             // "research" | "academic" | "engineering"
  date: "Fall 2024",
  featured: false,                  // true = badge + sorted first
  tools: ["MATLAB", "Simulink"],
  summary: "One or two sentences shown on the card.",
  details: [                        // bullets shown when the card is opened
    "What you did.",
    "How you did it.",
    "What the result was."
  ],
  thumb: "assets/img/projects/short-unique-id-thumb.jpg", // card image, 16:9 (optional)
  image: "assets/img/projects/short-unique-id.png",   // big image in the opened project (optional)
  gallery: [                                          // optional extra figures
    { src: "assets/img/projects/short-unique-id-plot.png", caption: "Pointing error vs. time" }
  ],
  links: [                                            // optional; links with an empty url are hidden
    { label: "Code", url: "https://github.com/..." },
    { label: "Report (PDF)", url: "assets/docs/report.pdf" }
  ]
},
```

Images look best at a 16:9 ratio, about 1200×675 px. Keep them under about 500 KB each.

## Previewing locally

Open `index.html` directly in a browser, or run a local server:

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploying to GitHub Pages

1. Create a GitHub repository named **`<your-username>.github.io`**.
2. Push this folder to it on the `main` branch.
3. In the repository, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, and select `main` / `(root)`.
4. After a minute or so, the site is live at `https://<your-username>.github.io`.
