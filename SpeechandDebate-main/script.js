const baseURL = "https://script.google.com/macros/s/AKfycbwhzMEw97HBYQfmJg7LmcBikzpinSCdTDBRJxFWX7r3OSaBLAvFHHZdqlZz67LB5iHNXg/exec";

window.addEventListener("load", () => {
    // Splash screen logic (kept for context, but handled inline in index.html)
});

// Function to format date and time
function formatDateTime(dateIsoString, timeIsoString) {
    let formattedDate = "Invalid Date";
    let formattedTime = "Invalid Time";

    // Format the date part (e.g., 1/1/2024)
    try {
        const dateObj = new Date(dateIsoString);
        if (!isNaN(dateObj.getTime())) {
            const month = dateObj.getMonth() + 1; // getMonth() is 0-indexed
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            formattedDate = `${month}/${day}/${year}`;
        }
    } catch (e) {
        console.error("Error formatting date:", e);
    }

    // Format the time part (e.g., 3:00 PM) from the ISO string
    try {
        const timeObj = new Date(timeIsoString); // Create a Date object from the time ISO string
        if (!isNaN(timeObj.getTime())) {
            // Use toLocaleTimeString for robust timezone-aware formatting
            // 'en-US' for AM/PM, hour12: true for 12-hour format
            formattedTime = timeObj.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    } catch (e) {
        console.error("Error formatting time:", e);
    }

    return { formattedDate, formattedTime };
}


// Fetch links (no change)
fetch(`${baseURL}?sheet=links`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const linksDiv = document.getElementById("links");
        linksDiv.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach(link => {
                const linkName = link.name || 'Unnamed Link';
                const linkUrl = link.link || '#';

                linksDiv.innerHTML += `
                    <div class="info-link-item">
                        <a href="${linkUrl}" target="_blank">
                            <span class="link-name">${linkName}</span>
                        </a>
                        <hr class="link-separator"/>
                    </div>`;
            });
        } else {
            linksDiv.innerText = "No useful links available at this time.";
        }
    })
    .catch(error => {
        console.error("Error fetching links:", error);
        document.getElementById("links").innerText = "Failed to load links. Please try again later.";
    });

// Fetch updates (UPDATED how date and time are used)
fetch(`${baseURL}?sheet=updates`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        const updatesDiv = document.getElementById("updates");
        updatesDiv.innerHTML = "";
        if (data && data.length > 0) {
            data.forEach(update => {
                // Pass both date and time strings to the formatter
                const { formattedDate, formattedTime } = formatDateTime(update.date, update.time);
                updatesDiv.innerHTML += `
                    <div class="update-item">
                        <strong>${update.name || 'No Name'}</strong> on <em>${formattedDate} at ${formattedTime}</em><br>
                        <p>${update.description || 'No description provided.'}</p>
                        <hr class="update-separator"/>
                    </div>`;
            });
        } else {
            updatesDiv.innerText = "No recent updates available at this time.";
        }
    })
    .catch(error => {
        console.error("Error fetching updates:", error);
        document.getElementById("updates").innerText = "Failed to load updates. Please try again later.";
    });

// Smooth scroll for "Information" button (no change)
document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Parallax Scroll Effect for Carousel Images (no change)
document.addEventListener('scroll', function() {
    const slides = document.querySelectorAll('.slide img');
    const scrollY = window.pageYOffset;

    slides.forEach(img => {
        if (img.closest('.slide').classList.contains('active')) {
            img.style.transform = `translateY(${scrollY * -0.05}px)`;
        } else {
            img.style.transform = `translateY(0px)`;
        }
    });
});
