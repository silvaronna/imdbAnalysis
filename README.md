# IMDB Dashboard

## Description
IMDB Dashboard is a web application designed to analyze and visualize IMDb data. It provides an interactive interface with insightful metrics, dynamic filtering by time frames, and visual charts representing movie trends, such as elite content ratings (8.0+) and top genres. The application is built with modern web technologies to ensure a responsive and aesthetic user experience.

## Tech Stack
- **Framework:** [Vue 3](https://vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Visualization:** [Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/)
- **Data Parsing:** [PapaParse](https://www.papaparse.com/)
- **Icons:** [Oh, Vue Icons!](https://oh-vue-icons.js.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Deployment:** GitHub Pages (`gh-pages`)

## Folder Structure
```text
imdbAnalysis/
├── dist/                # Production build output (generated after build)
├── node_modules/        # Project dependencies
├── public/              # Static assets (e.g., favicon, raw data files)
├── src/                 # Application source code
│   ├── components/      # Reusable Vue components
│   ├── composables/     # Vue composables for reusable stateful logic
│   ├── router/          # Vue Router configuration
│   ├── views/           # Vue page views (e.g., Dashboard view)
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global CSS styles
├── index.html           # Main HTML entry point
├── package.json         # Project metadata, dependencies, and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vincensiusanthony/imdbAnalysis.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd imdbAnalysis
   ```

3. **Install NPM packages**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local URL provided in the terminal (usually `http://localhost:5173/`).

### Deployment
To build the application and deploy it to GitHub Pages, run:
```bash
npm run deploy
```
