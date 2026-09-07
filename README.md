# StudentBlog

A small, self-contained blogging platform. No backend, no build step — open `index.html` in a browser, or open the folder in VS Code and use the "Live Server" extension for auto-reload while you edit.

## 🚀 Live Demo

Check out the live website here: [https://blog-mu-six-69.vercel.app/](https://blog-mu-six-69.vercel.app/)

## Structure

```
studentblog/
├── index.html   # page structure
├── style.css    # styling (design tokens at the top of the file)
└── script.js    # feed / post / editor logic + sample posts
```

## Running it

Easiest: open `index.html` directly in your browser.

For live-reload while editing in VS Code: install the **Live Server** extension, right-click `index.html`, and choose "Open with Live Server".

## Notes

- Posts are stored in a plain JavaScript array in `script.js` (`let posts = [...]`) — publishing a new post only persists for the current browser session and resets on reload.
- To make posts persist, you'd want to add a backend (e.g. a small Node/Express API with a database) or wire up browser storage.
