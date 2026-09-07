const root = document.getElementById('root');
const navFeed = document.getElementById('navFeed');
const navWrite = document.getElementById('navWrite');

let posts = [
  {
    id: 3,
    title: "The case for writing things down slowly",
    author: "Mira Okafor",
    date: "Sep 2",
    tags: ["writing", "process"],
    body: `There's a particular kind of thinking that only happens with a pen moving slower than your thoughts. Typing keeps pace with the first draft of an idea; longhand forces you to wait for the second, truer one.\n\nI've started keeping two documents for anything that matters: a fast one, typed, for getting the shape of an argument down, and a slow one, handwritten, for finding out whether I actually believe it.\n\nMost of what I publish now starts its life in the second document.`
  },
  {
    id: 2,
    title: "Notes on building small tools",
    author: "Dev Raheja",
    date: "Aug 27",
    tags: ["building", "tools"],
    body: `Small tools age better than big ones. A script that does one thing, with no dependencies to speak of, tends to still work five years later. A platform rarely does.\n\nThis isn't an argument against ambition — it's an argument for building the small, ugly version first, and only reaching for more architecture once the small version has actually taught you something about the problem.`
  },
  {
    id: 1,
    title: "A short list of things worth reading twice",
    author: "Mira Okafor",
    date: "Aug 19",
    tags: ["reading"],
    body: `Most writing is meant to be read once. A little of it rewards a second pass — not because it was unclear the first time, but because it was dense enough that your first reading missed something.\n\nI keep a running list. It's short on purpose.`
  }
];
let nextId = 4;
let currentView = 'feed';
let currentPostId = null;

function excerpt(body){
  const first = body.split('\n\n')[0];
  return first.length > 160 ? first.slice(0, 157) + '…' : first;
}
function readTime(body){
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)) + ' min read';
}

function setActiveNav(view){
  navFeed.classList.toggle('active', view === 'feed' || view === 'post');
  navWrite.classList.toggle('active', view === 'write');
}

function renderFeed(){
  currentView = 'feed';
  setActiveNav('feed');
  if(posts.length === 0){
    root.innerHTML = `<p class="feed-intro">Essays, notes, and unfinished thoughts.</p><div class="empty">Nothing published yet. Write the first one.</div>`;
    return;
  }
  const stories = posts.map(p => `
    <div class="story" data-id="${p.id}">
      <div class="story-byline"><span class="author">${p.author}</span> · ${p.date} · ${readTime(p.body)}</div>
      <h2>${escapeHtml(p.title)}</h2>
      <p class="excerpt">${escapeHtml(excerpt(p.body))}</p>
      <div class="tags">${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
    </div>
  `).join('');
  root.innerHTML = `<p class="feed-intro">Essays, notes, and unfinished thoughts.</p>${stories}`;
  root.querySelectorAll('.story').forEach(el => {
    el.addEventListener('click', () => renderPost(Number(el.dataset.id)));
  });
}

function renderPost(id){
  const post = posts.find(p => p.id === id);
  if(!post) return renderFeed();
  currentView = 'post';
  currentPostId = id;
  setActiveNav('post');
  const paragraphs = post.body.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
  root.innerHTML = `
    <div class="post-view">
      <button class="back" id="backBtn">← Back to Read</button>
      <h1>${escapeHtml(post.title)}</h1>
      <div class="post-byline"><span class="author">${post.author}</span> · ${post.date} · ${readTime(post.body)}</div>
      <div class="post-body">${paragraphs}</div>
      <div class="tags" style="margin-top:30px;">${post.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
    </div>
  `;
  document.getElementById('backBtn').addEventListener('click', renderFeed);
}

function renderEditor(){
  currentView = 'write';
  setActiveNav('write');
  root.innerHTML = `
    <div class="editor">
      <label>Title</label>
      <input type="text" id="fTitle" placeholder="Give it a headline">
      <div class="meta-row">
        <div>
          <label>Your name</label>
          <input type="text" class="small" id="fAuthor" placeholder="Author">
        </div>
        <div>
          <label>Tags (comma separated)</label>
          <input type="text" class="small2" id="fTags" placeholder="writing, notes">
        </div>
      </div>
      <label>Body</label>
      <textarea id="fBody" placeholder="Write here. Leave a blank line between paragraphs."></textarea>
      <div class="editor-footer">
        <span class="hint">Published posts appear at the top of Read. This session only — nothing is saved after you close the tab.</span>
        <button class="publish-btn" id="publishBtn">Publish</button>
      </div>
    </div>
  `;
  document.getElementById('publishBtn').addEventListener('click', () => {
    const title = document.getElementById('fTitle').value.trim();
    const author = document.getElementById('fAuthor').value.trim() || 'Anonymous';
    const tagsRaw = document.getElementById('fTags').value.trim();
    const body = document.getElementById('fBody').value.trim();
    if(!title || !body){
      document.getElementById(title ? 'fBody' : 'fTitle').focus();
      return;
    }
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['notes'];
    const date = new Date().toLocaleDateString([], {month:'short', day:'numeric'});
    posts.unshift({ id: nextId++, title, author, date, tags, body });
    renderFeed();
  });
}

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

navFeed.addEventListener('click', renderFeed);
navWrite.addEventListener('click', renderEditor);

renderFeed();
