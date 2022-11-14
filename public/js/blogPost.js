const { response } = require("express");

// TODO: create new post button
const createBlogPost = async function (event) {
  //collect values from title and content
  const title = document.getElementById('blog-title').value.trim();
  const content = document.getElementById('blog-content').value.trim();

  // send a CREATE request to this route
  if (title && content) {
    const response = await fetch('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok){
      document.location.replace('/dashboard');
    } else {
      alert('Failed to create post');
    }
  }
};

document.getElementById('create-post').addEventListener('click', createBlogPost);

// TODO: update post button
const updateBlogPost = async function (event) {

  //collect value from content 
  const blogContent = document.getElementById('blog-content').value.trim();

  // send a UPDATE request to this route
  const response = await fetch('/api/posts/:id', {
    method: 'UPDATE',
    body: JSON.stringify({ blogContent }),
    headers: { 'Content-Type': 'application/json' },
  });

  // If the request worked, then go back to the dashboard
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
    console.log('not working');
  }
};

document.getElementById('update-btn').addEventListener('click', updateBlogPost);

// TODO: delete post button