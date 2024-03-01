// API base URL:
const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

// Finding HTML elements:
const getElement = (inputId) => document.getElementById(inputId);
// New post inputs:
const titleInput = getElement('new-post-title');
const bodyInput = getElement('new-post-body');
// Posts placement:
const postsDiv = getElement('posts');
// Add post button:
const addPostBtn = getElement('add-post');

// Fetching posts from the API:
async function fetchPosts() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok)
      throw new Error(`Failed fetching posts. Status: ${res.status}`);
    const data = await res.json();
    console.log('fetchPosts data:', data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

// Upload new post to the API:
async function postPost(postTitle, postBody, userId) {
  try {
    const headers = new Headers({ 'content-type': 'application/json' });
    const body = JSON.stringify({
      title: postTitle,
      body: postBody,
      userId, // in case API supported a real POST
    });

    const res = await fetch(BASE_URL, { method: 'POST', headers, body });
    console.log('postPost res:', res);
    if (!res.ok) throw new Error(`Failed to post. Status: ${res.status}`);
    const data = await res.json();

    console.log('postPost data:', data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

// Create HTML for each post:
const createPostHTML = ({ title, body }) =>
  `<div class='post' >
        <div class='post-content' >
            <div class='post-title' >
                ${title}
            </div>
            <div class='post-body' >
                ${body}
            </div>
        </div>
    </div>`;

// Create HTML for a specific post:
function renderPost(post, placement, position) {
  const newPostHTML = createPostHTML(post);
  placement.insertAdjacentHTML(position, newPostHTML);
}

// Render all posts:
function showPosts(posts) {
  postsDiv.innerHTML = '';
  posts.forEach((post) => {
    renderPost(post, postsDiv, 'beforeend');
  });
}

// Fetch and display posts on page load:
fetchPosts()
  .then((posts) => showPosts(posts))
  .catch((e) => console.error(e));

//  Button functionality:
addPostBtn.addEventListener('click', (ev) => {
  ev.preventDefault();

  postPost(titleInput.value, bodyInput.value, 0)
    .then((post) => {
      // adding new post 'optimistically':
      if (post) renderPost(post, postsDiv, 'afterbegin');
    })
    .catch((e) => console.error(e));
});
