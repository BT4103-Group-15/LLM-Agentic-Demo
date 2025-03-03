fetch('../templates/navbar.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to load navbar.html: ' + response.statusText);
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
  })
  .catch(error => {
    console.error('Error:', error);
  });


function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  }
  