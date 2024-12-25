import fs from 'node:fs/promises'
import express from 'express'
import path from 'node:path'
import compression from 'compression'
import sirv from 'sirv'

const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Create http server
const app = express()

// Add production middlewares to serve static files
app.use(compression())
app.use(base, sirv(path.join('dist'), { extensions: [] }))

// Catch-all route: Serve index.html for non-asset requests (SPA behavior)
app.get('*', async (req, res, next) => {
    // Skip requests for static assets (e.g., .js, .css, .png, etc.)
    if (req.originalUrl.endsWith('.js') || req.originalUrl.endsWith('.css') || req.originalUrl.endsWith('.png')) {
        return next(); // Let sirv handle static assets
    }

    try {
        // Serve index.html for all other requests (i.e., SPA routes)
        const template = await fs.readFile(path.join('dist', 'index.html'), 'utf-8')
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template)
    } catch (e) {
        console.error(e.stack)
        res.status(500).end(e.stack)
    }
})

// Start the server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
