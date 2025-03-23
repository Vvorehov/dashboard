# 📋 Task Dashboard

Hey there! Welcome to my Task Dashboard project - a little app I made as a home task which built to help manage projects and tasks with a clean, modern interface. It could be improved together to something bigger that it made right now.

## Check it out!

The app is live at: [https://vvorehov.github.io/dashboard/](https://vvorehov.github.io/dashboard/)

## What can you do with it?

- Create your own projects and fill them with tasks
- There are 3 columns - "Pending," "In Progress," and "Completed"
- Set priorities (because we all know some tasks are more urgent than others!)
- Add due dates to keep yourself on track
- Everything saves right in your browser, so your data stays with you

## The tech stuff (for the curious)

I built this using:
- Vue 3 (with that sweet Composition API)
- Vuex 4 for state management
- Vue Router for navigation
- Element Plus for those shiny UI components
- Vite (because it's super fast!)
- TypeScript (for fewer bugs and better code hints)
- Testing with Vitest and Cypress

## 🏁 Getting started

### What you'll need:
- Node.js (v14 or newer)
- npm or yarn

### Quick setup:

1. Grab the code:
   ```bash
   git clone https://github.com/Vvorehov/dashboard.git
   cd dashboard
   ```

2. Install the goodies:
   ```bash
   npm install
   # or if you're a yarn fan
   yarn
   ```

3. Fire it up:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and head to the URL in your terminal (usually http://localhost:5173/dashboard/)

## Handy commands

- `npm run dev` - Start your local development server
- `npm run build` - Package everything up for production
- `npm run preview` - See what the production build looks like locally
- `npm run type-check` - Make sure your TypeScript is behaving
- `npm run test` - Run the tests
- `npm run test:coverage` - See how much of your code is tested

### Running End-to-End Tests

The app includes E2E tests using Cypress that cover basic navigation:

- Dashboard loading and title verification
- Ensuring the dashboard home page displays correctly
- Navigation to the project creation page
- Navigation back to the dashboard home

```bash
# Run tests in GUI mode
npm run test:e2e

# Run tests headlessly
npm run test:e2e:headless
```

## Deployment

This app automatically deploys to GitHub Pages whenever you push to the main branch. GitHub Actions handles all the heavy lifting (check out `.github/workflows/deploy.yml` if you're curious how).

### Want to deploy it yourself?

1. Build it:
   ```bash
   npm run build
   ```

2. Take the `dist` folder and put it on your favorite hosting service!

## Want to contribute?

I'd love the help! Here's how:

1. Fork the repo
2. Create your feature branch: `git checkout -b cool-new-feature`
3. Commit your changes: `git commit -m 'Added something awesome'`
4. Push to your branch: `git push origin cool-new-feature`
5. Open a Pull Request!

## 📝 License

Feel free to use this code however you want - it's under the [MIT License](LICENSE).
