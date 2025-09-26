# mtm6302-capstone-zhan0832
## Name: Yan Zhang
## Student number: 041125831
## Project: Capstone
## HI-FI design
### Home Page
- **Hero Section**  
  Displays a featured photo with title and summary text.  
  Includes a **“Read more”** button that navigates to the detail page.

- **Search by Date**  
  Users can select a start and end date.  
  All photos within that range are displayed in a responsive grid.


### Detail Page
- Shows the full photo information including title, summary, tags, and date.  
- **Clicking the photo opens a full-screen view (Lightbox).**  
- Includes a toggle button:
  - **Add to My Favourite** if not in favourites  
  - **Remove from My Favourite** if already added

### My Favourite Page
- Displays all photos the user has marked as favourites.  
- If there are no favourites yet, the page shows an empty state message with a link back to Home.  
- The navigation bar shows a counter badge with the number of favourite items.

## Style Guide

### Colors
- **Primary:** `#F1991F` ![#F1991F](https://via.placeholder.com/15/F1991F/000000?text=+)  
- **Background:** `#EBE9D9` ![#EBE9D9](https://via.placeholder.com/15/EBE9D9/000000?text=+)  
- **Text / Black:** `#000001` ![#000001](https://via.placeholder.com/15/000001/000000?text=+)

### Font
- **Inter** (Google Fonts)

## Development Process & Implementation Report

## Development Steps

### Step 1: Project Setup
- Created HTML structure for homepage and favorites page
- Set up CSS architecture with custom properties
- Added responsive navigation system

### Step 2: Design Implementation  
- Applied color scheme: Orange (`#F1991F`) and cream (`#EBE9D9`) backgrounds
- Integrated Inter font from Google Fonts
- Built responsive layouts for mobile and desktop

### Step 3: Homepage Features
- Created hero section with featured image display
- Added responsive image grid (3→6 columns)
- Implemented date search interface

### Step 4: Favorites Page
- Added Material Symbols star icons
- Created interactive star buttons with hover effects
- Built responsive grid layout for favorite images

## Resources Used

### Development Tools
- **VS Code** - Code editor
- **Browser DevTools** - Testing and debugging
- **Git** - Version control

### External Resources
- **Google Fonts** - Inter typography and Material Symbols icons
- **MDN Web Docs** - CSS Grid and Flexbox documentation
- **CSS-Tricks** - Layout techniques and best practices

## Challenges Faced

### 1. Layout Alignment
**Problem:** Elements not aligning consistently with navigation  
**Solution:** Used shared container system with consistent max-width

### 2. Star Icon Centering
**Problem:** Material Symbols icons not centering in circular buttons  
**Solution:** Flexbox alignment with proper font sizing

## Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern layout with Grid and Flexbox
- **Google Fonts** - Typography and icons
- **Responsive Design** - Mobile-first approach

