# mtm6302-capstone-zhan0832
## Name: Yan Zhang
## Student number: 041125831
## Project: Capstone 4  
### JavaScript Implementation (Home Page)

**Step 1–3:**  
I selected the required DOM elements, created small utility functions for date formatting and localStorage handling, and implemented a simple render function to display favourite images stored in localStorage.

**Step 4:**  
I used the Fetch API to request the Wikimedia Featured Image data based on the selected date. The response was then used to update the main feature area, including the image, title, date, and description.

**Step 5:**  
I built a basic favourite toggle system that adds or removes the current image URL from localStorage and re-renders the favourites section to reflect the updated list.

**Step 6–7:**  
I added event listeners for the date input, heart buttons, feature image, and favourites grid. A `<dialog>` element was used as a lightbox to display larger image previews. I also prevented default navigation behaviour to ensure the web application runs as a single-page experience without page refreshes.

**Step 8:**  
During initialization, I set the date input to the current day, loaded the corresponding Picture of the Day, and displayed any favourites previously stored in localStorage.
