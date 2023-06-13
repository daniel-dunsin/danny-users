const statusBar = document.querySelector('.status-tab');

const closeIcon = statusBar?.querySelector('.fa-times');

const closeStatusBar = () => {
  statusBar.classList.remove('active');
};

closeIcon?.addEventListener('click', closeStatusBar);
