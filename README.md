# Haniyeh Zahra Budaqi: Portfolio

My personal academic portfolio. It is a static site (plain HTML, CSS and JS with no build step), hosted on GitHub Pages.

## Structure

```
index.html            landing page: lets visitors choose research or embedded
research/index.html   research portfolio  -> hannalujah.github.io/research/
embedded/index.html   embedded portfolio  -> hannalujah.github.io/embedded/
data/content.js       ALL the content: profile, publications, projects, experience...
data/content-embedded.js  embedded-page wording + which projects it shows
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

## The embedded portfolio (`/embedded/`)

A second version of the site aimed at embedded and flight-software roles is served at `https://hannalujah.github.io/embedded/`.

- `embedded/index.html`: page layout (Experience first, with a circuit-board hero animation from `assets/js/bus.js`)
- `data/content-embedded.js`: wording for this page (role, tagline, about, "What I work on", skills) plus **which projects appear and under which category**
- `assets/CV_Haniyeh_Budaqi_Embedded.pdf`: the CV linked from this page

Projects, experience, education and publications all come from `data/content.js`, so you edit each one in only one place. To show a project on the embedded page, add its `id` to the `projects` list in `content-embedded.js`, for example:

```js
pick("my-new-firmware-project", { category: "firmware", featured: true }),
```

You can also override any field for this page only, such as `details` or `summary`.

