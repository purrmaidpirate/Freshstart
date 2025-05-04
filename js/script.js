document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const resizeHandle = document.getElementById('resize-handle');
    const sidebar = document.getElementById('sidebar');
    const contentArea = document.getElementById('content-area');
    
    // Exit if required elements aren't found
    if (!resizeHandle || !sidebar || !contentArea) {
        console.error('Required elements not found.');
        return;
    }
    
    let isResizing = false;
    
    // Common resize function to avoid code duplication
    function performResize(clientX) {
        const newWidth = clientX;
        
        if (newWidth > 200 && newWidth < window.innerWidth * 0.7) {
            // Update sidebar width
            sidebar.style.width = newWidth + 'px';
            
            // Update resize handle position
            resizeHandle.style.left = newWidth + 'px';
            
            // Update content area margin and width
            contentArea.style.marginLeft = (newWidth + 10) + 'px';
            contentArea.style.width = `calc(100% - ${newWidth + 10}px)`;
        }
    }
    
    // Mouse events for desktop
    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        resizeHandle.classList.add('active');
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        performResize(e.clientX);
    });
    
    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            resizeHandle.classList.remove('active');
            document.body.style.cursor = 'default';
        }
    });
    
    // Touch events for mobile
    resizeHandle.addEventListener('touchstart', function(e) {
        isResizing = true;
        resizeHandle.classList.add('active');
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isResizing) return;
        e.preventDefault(); // Prevent scrolling while resizing
        
        if (e.touches && e.touches.length > 0) {
            performResize(e.touches[0].clientX);
        }
    });
    
    document.addEventListener('touchend', function() {
        if (isResizing) {
            isResizing = false;
            resizeHandle.classList.remove('active');
        }
    });
});


// Get cursor element
const cursor = document.querySelector('.custom-cursor');

// Previous mouse positions for smoothing
let prevX = 0;
let prevY = 0;

// Smoothing factor (0-1, lower = smoother)
const smoothing = 0.15;

// Mouse velocity tracking for scaling effect
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let velocityX = 0;
let velocityY = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
  // Get current mouse position
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation loop for smooth following and velocity effects
function animateCursor() {
  // Calculate velocity
  velocityX = Math.abs(mouseX - lastMouseX);
  velocityY = Math.abs(mouseY - lastMouseY);
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  
  // Calculate overall velocity (distance from last frame)
  const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
  
  // Apply smooth following
  prevX = prevX + (mouseX - prevX) * smoothing;
  prevY = prevY + (mouseY - prevY) * smoothing;
  
  // Calculate scale based on velocity
  const scale = 1 + Math.min(velocity / 30, 1); // Cap scaling at 2x
  
  // Apply position and scale
  cursor.style.left = `${prevX}px`;
  cursor.style.top = `${prevY}px`;
  cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;
  
  requestAnimationFrame(animateCursor);
}

// Start animation loop
animateCursor();

// Handle cursor on links
const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.style.transform = `translate(-50%, -50%) scale(1.5)`;
  });
  
  link.addEventListener('mouseleave', () => {
    cursor.style.transform = `translate(-50%, -50%) scale(1)`;
  });
});

// Hide cursor when it leaves the window
document.addEventListener('mouseout', (e) => {
  if (e.relatedTarget === null) {
    cursor.style.display = 'none';
  }
});

document.addEventListener('mouseover', () => {
  cursor.style.display = 'block';
});