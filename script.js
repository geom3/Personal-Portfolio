// Loading Screen Functionality - Made quicker
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    
    // Simulate loading progress - Made quicker
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 25; // Increased from 15 to 25
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Complete loading and hide loading screen
            loadingProgress.style.width = '100%';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Start welcome animations after loading screen is hidden
                startWelcomeAnimations();
            }, 300); // Reduced from 500 to 300
        }
        
        loadingProgress.style.width = `${progress}%`;
    }, 150); // Reduced from 300 to 150
});

// Function to start welcome animations
function startWelcomeAnimations() {
    // Animate the title spans
    const titleSpans = document.querySelectorAll('.title-tspan');
    titleSpans.forEach(span => {
        const delay = span.style.animationDelay;
        span.style.animation = `fadeInUp 0.4s ease-out ${delay} forwards`;
    });
    
    // Animate the subtitle
    const subtitle = document.querySelector('.welcome-subtitle');
    subtitle.style.animation = 'fadeIn 0.5s ease-out 1.2s forwards';
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Projects Circle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectCircles = document.querySelectorAll('.project-circle');
    const centerCircle = document.querySelector('.center-circle');
    const projectsWrapper = document.getElementById('projectsWrapper');
    const projectDetails = document.getElementById('projectDetails');
    
    let activeProject = null;
    let autoRotateInterval = null;
    let inactivityTimer = null;
    let isAutoRotating = true;
    let currentRotationIndex = 0;
    let circlePositions = [];
    let currentRadius = 0; // store computed radius so other functions can use it
    
    // Project data
    const projects = [
        {
            title: "A small recipes",
            description: "My first ever website, took a long time to create , Most of it was Html and little sprinkles of Css.",
            link: "https://geom3.github.io/odin-recipes/",
            linkText: "https://geom3.github.io/odin-recipes/"
        },
        {
            title: "Landing page",
            description: "Main page template, There isn't much details as an intention to edit it for other projects",
            link: "https://geom3.github.io/Try-Landing-Page/",
            linkText: "https://geom3.github.io/Try-Landing-Page/"
        },
        {
            title: "CAFÉ website",
            description: "it is a full project simple and lively , it was a project assigned to me by Sprints x Microsoft summer camp-web Development",
            link: "https://geom3.github.io/harmony-cafe/",
            linkText: "https://geom3.github.io/harmony-cafe/"
        },
        {
            title: "My freecodecamp",
            description: "An account to show the certification projects i made",
            link: "https://www.freecodecamp.org/geom",
            linkText: "https://www.freecodecamp.org/geom"
        }
    ];
    
    // Position project circles around the center on the left hemisphere with better spacing
    function positionCircles() {
        const wrapperW = projectsWrapper.offsetWidth;
        const wrapperH = projectsWrapper.offsetHeight;

        // read sizes for center and a project to compute safe radius
        const centerRect = centerCircle.getBoundingClientRect();
        const projRect = projectCircles[0] ? projectCircles[0].getBoundingClientRect() : { width: 120, height: 120 };
        const projSize = Math.max(projRect.width, projRect.height, 120);

        // Base radius relative to wrapper size (closer to your original)
        let radius = Math.min(wrapperW, wrapperH) * 0.3;

        // Ensure radius is at least large enough to avoid overlap with center circle
        const minRadius = (Math.max(centerRect.width, centerRect.height) / 2) + (projSize / 2) + 40;
        radius = Math.max(radius, minRadius);

        // store for other functions to use
        currentRadius = radius;

        const centerX = wrapperW / 2;
        const centerY = wrapperH / 2;
        
        // Clear previous positions
        circlePositions = [];
        
        // Angles match your original left-hemisphere layout (radians)
        const angles = [
            4.712388980385, // 270°
            3.665191429188, // 210°
            2.617993877991, // 150°
            1.570796326795  // 90°
        ];
        
        projectCircles.forEach((circle, index) => {
            const angle = angles[index] || (Math.PI + (index * 0.5)); // fallback
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
        
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            
            // Store the position for resetting later (original positions)
            circlePositions[index] = { x, y };
            
            // Reset any state classes/sizes just in case
            circle.classList.remove('active', 'hidden');
            circle.style.width = '';
            circle.style.height = '';
            
            // Position the label to the left of the circle
            positionLabel(circle, x, y, centerX, centerY);
        });
    }
    
    // Position label to the left of the circle
    function positionLabel(circle, x, y, centerX, centerY) {
        const label = circle.querySelector('.project-label');
        if (!label) return;
        
        // Reset any previous positioning
        label.style.left = '';
        label.style.right = '';
        label.style.top = '';
        label.style.margin = '';
        label.style.transform = '';
        
        // Always position label to the left of the circle
        label.style.right = 'calc(100% + 15px)';
        label.style.top = '50%';
        label.style.transform = 'translateY(-50%)';
    }
    
    // Reset all to initial state
    function resetView() {
        // Reset center circle to center and original size
        centerCircle.style.width = '350px';
        centerCircle.style.height = '350px';
        centerCircle.style.left = '50%';
        
        // Reset all project circles to their original positions
        projectCircles.forEach((circle, index) => {
            circle.classList.remove('active', 'hidden');
            circle.style.width = '';
            circle.style.height = '';
            circle.style.zIndex = '5';
            
            // Reset to original position
            if (circlePositions[index]) {
                circle.style.left = `${circlePositions[index].x}px`;
                circle.style.top = `${circlePositions[index].y}px`;
            }
        });
        
        // Hide project details
        projectDetails.classList.remove('active');
        
        activeProject = null;
        
        // Restart auto-rotation if it was enabled
        if (isAutoRotating) {
            startAutoRotation();
        }
    }
    
    // Update project details content
    function updateProjectDetails(projectId) {
        const project = projects[projectId - 1];
        if (!project) return;
        
        // Create link HTML if project has a link
        const linkHTML = project.link ? 
            `<a href="${project.link}" target="_blank" class="project-link">${project.linkText || 'View Project'}</a>` : 
            '';
        
        projectDetails.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            ${linkHTML}
        `;
        
        projectDetails.classList.add('active');
    }
    
    // Start auto rotation
    function startAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
        
        autoRotateInterval = setInterval(() => {
            // Reset view first
            resetViewForAutoRotation();
            
            // Show the next project in rotation
            const nextIndex = currentRotationIndex % projectCircles.length;
            const circle = projectCircles[nextIndex];
            const projectId = circle.getAttribute('data-project');
            
            // Move center circle further to the right and make it bigger (same as your original)
            centerCircle.style.width = '500px';
            centerCircle.style.height = '500px';
            centerCircle.style.left = '92%';
            
            // Scale up the current circle and bring to front — use original size 350
            circle.classList.add('active');
            circle.style.width = '350px';
            circle.style.height = '350px';
            circle.style.zIndex = '15';
            
            // Move the active circle to fixed offsets (but tuned: less right, more up),
            // with adaptation for display scaling (devicePixelRatio).
            const centerX = projectsWrapper.offsetWidth / 2;
            const centerY = projectsWrapper.offsetHeight / 2;

            const scale = window.devicePixelRatio || 1;
            const baseXMul = 0.22;   // smaller X multiplier (less right)
            const baseYMul = 0.65;   // larger Y multiplier (more up)
            const scaleX = 1 / Math.max(1, scale * 0.9);
            const scaleY = Math.max(1, scale * 1.05);

            const offsetX = Math.min(100, Math.round(currentRadius * baseXMul * scaleX));
            const offsetY = Math.min(220, Math.round(currentRadius * baseYMul * scaleY));

            circle.style.left = `${centerX + offsetX}px`;
            circle.style.top = `${centerY - offsetY}px`;
            
            // Hide all other circles (original design)
            projectCircles.forEach(otherCircle => {
                if (otherCircle !== circle) {
                    otherCircle.classList.add('hidden');
                    otherCircle.style.zIndex = '5';
                    otherCircle.style.width = '120px';
                    otherCircle.style.height = '120px';
                }
            });
            
            // Update project details
            updateProjectDetails(projectId);
            
            // Move to next index
            currentRotationIndex = (currentRotationIndex + 1) % projectCircles.length;
            
        }, 4000);
    }
    
    // Reset view for auto-rotation
    function resetViewForAutoRotation() {
        // Reset center circle to center and original size
        centerCircle.style.width = '350px';
        centerCircle.style.height = '350px';
        centerCircle.style.left = '50%';
        
        // Reset all project circles
        projectCircles.forEach((circle, index) => {
            circle.classList.remove('active', 'hidden');
            circle.style.width = '';
            circle.style.height = '';
            circle.style.zIndex = '5';
            
            // Reset to original position
            if (circlePositions[index]) {
                circle.style.left = `${circlePositions[index].x}px`;
                circle.style.top = `${circlePositions[index].y}px`;
            }
        });
        
        // Hide project details
        projectDetails.classList.remove('active');
    }
    
    // Stop auto rotation
    function stopAutoRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }
    
    // Reset inactivity timer
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (!isAutoRotating) {
                isAutoRotating = true;
                startAutoRotation();
            }
            inactivityTimer = null;
        }, 4000); // Reduced from 5000 to 4000 milliseconds
    }
    
    // Manually show a project
    function showProject(index) {
        const circle = projectCircles[index];
        const projectId = circle.getAttribute('data-project');
        
        // Stop auto-rotation when user interacts
        stopAutoRotation();
        isAutoRotating = false;
        
        // Reset inactivity timer
        resetInactivityTimer();
        
        // If clicking the same circle again, reset view
        if (activeProject === projectId) {
            resetView();
            return;
        }
        
        // Reset any previously active project (restore them)
        if (activeProject) {
            projectCircles.forEach((c, i) => {
                c.classList.remove('active', 'hidden');
                c.style.width = '';
                c.style.height = '';
                c.style.zIndex = '5';
                if (circlePositions[i]) {
                    c.style.left = `${circlePositions[i].x}px`;
                    c.style.top = `${circlePositions[i].y}px`;
                }
            });
        }
        
        // Set new active project
        activeProject = projectId;
        
        // Move center circle further to the right and make it bigger (same as original)
        centerCircle.style.width = '500px';
        centerCircle.style.height = '500px';
        centerCircle.style.left = '92%';
        
        // Scale up the clicked circle and bring to front
        circle.classList.add('active');
        circle.style.width = '350px';
        circle.style.height = '350px';
        circle.style.zIndex = '15';
        
        // Move the active circle to the right and up using tuned offsets (less right, more up)
        const centerX = projectsWrapper.offsetWidth / 2;
        const centerY = projectsWrapper.offsetHeight / 2;

        const scale = window.devicePixelRatio || 1;
        const baseXMul = 0.22;   // smaller X multiplier
        const baseYMul = 0.65;   // larger Y multiplier
        const scaleX = 1 / Math.max(1, scale * 0.9);
        const scaleY = Math.max(1, scale * 1.05);

        const offsetX = Math.min(100, Math.round(currentRadius * baseXMul * scaleX));
        const offsetY = Math.min(220, Math.round(currentRadius * baseYMul * scaleY));

        circle.style.left = `${centerX + offsetX}px`;
        circle.style.top = `${centerY - offsetY}px`;
        
        // Hide all other circles (original design)
        projectCircles.forEach((otherCircle) => {
            if (otherCircle !== circle) {
                otherCircle.classList.add('hidden');
                otherCircle.style.zIndex = '5';
                otherCircle.style.width = '120px';
                otherCircle.style.height = '120px';
            }
        });
        
        // Update project details
        updateProjectDetails(projectId);
    }
    
    // Add click events to project circles
    projectCircles.forEach((circle, index) => {
        circle.addEventListener('click', function() {
            showProject(index);
        });
    });
    
    // Add click event to reset view when clicking on the center circle
    centerCircle.addEventListener('click', function() {
        if (activeProject) {
            resetView();
            resetInactivityTimer();
        }
    });
    
    // Adjust layout on window resize
    window.addEventListener('resize', positionCircles);
    
    // Initialize circle positions and start auto-rotation
    positionCircles();
    startAutoRotation();
    resetInactivityTimer();
});
