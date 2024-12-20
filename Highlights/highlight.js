
    // Function to change the main video source
        function changeVideo(videoSrc) {
        const mainVideo = document.getElementById("mainVideo");
        mainVideo.src = videoSrc;
        mainVideo.play();
        }

        // Function to scroll the carousel
        function scrollCarousel(direction) {
        const carousel = document.querySelector(".carousel");
        const scrollAmount = 300; // Amount to scroll on each arrow click
        if (direction === "left") {
            carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else if (direction === "right") {
            carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
        }

        // Automatic scrolling
        setInterval(() => {
        const carousel = document.querySelector(".carousel");
        if (carousel) {
            carousel.scrollBy({ left: 300, behavior: "smooth" });
        }
        }, 100); // Automatically scroll every 3 seconds
