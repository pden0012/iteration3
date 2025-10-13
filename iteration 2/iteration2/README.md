# Hay Fever Management Website - Vue Version

## Project Overview
This is a Vue 3-based hay fever management website that provides pollen and allergen tracking, educational resources, emergency health support, and other features.

## Tech Stack
- **Vue 3** - Frontend Framework
- **Vite** - Build Tool
- **CSS3** - Styling and Layout
- **JavaScript ES6+** - Programming Language

## Project Structure

### File Structure
```
/
├── index.html                 # Project Entry HTML File
├── package.json              # Project Dependencies Configuration
├── vite.config.js            # Vite Build Configuration
├── src/                      # Source Code Directory
│   ├── main.js              # Vue Application Entry File
│   ├── App.vue              # Root Component (Global Layout)
│   └── components/          # Vue Components Directory
│       └── HomePage.vue     # Homepage Component
├── public/                  # Public Resources Directory
│   └── images/             # Image Resources
│       ├── placeholder.txt # Image Description
│       └── icons/          # Icons Directory
└── README.md               # Project Documentation
```

### Component Architecture
1. **App.vue** - Root Component, responsible for global layout and navigation
   - Navigation Bar (including Logo and Menu)
   - Main Content Area
   - Footer
2. **HomePage.vue** - Homepage Component, contains all homepage content
   - Hero Section
   - Features Section
   - Info Section

### Component Hierarchy
```
App.vue (Root Component - Global Layout)
├── Navigation Bar (Built-in)
├── HomePage.vue (Homepage)
│   ├── Hero Section
│   ├── Features Section
│   └── Info Section
└── Footer (Built-in)
```

## Page Layout

### Design Features
- **Color Scheme**:
  - Primary Color: #239BA7 (Teal Blue)
  - Accent Color: #F9D65C (Golden Yellow)
  - Background Color: #FFFFFF (White)
  - Text Color: #1E1E1E (Dark Gray)

- **Typography**:
  - Headings: Questrial (Large Titles)
  - Body Text: Inter, AR One Sans, Average Sans

- **Layout**:
  - Responsive Design
  - Flexbox and Grid Layout
  - Rounded Corner Design Elements
  - Card-based Layout

### Feature Modules
1. **Pollen Tracker**: Real-time display of pollen index, tree, grass, ragweed, dust levels for your location
2. **Map Functionality**: Interactive Victoria map showing allergen hotspots and safe zones
3. **Trend Analysis**: Track allergen patterns over time and outlook of pollen and allergen conditions
4. **Educational Resources**: Articles, guides and tips for managing hay fever naturally and medically
5. **Health Support**: Quick access to clinics, pharmacies and urgent care contacts

## Development Guide

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```

### Build Production Version
```bash
npm run build
```

### Preview Production Version
```bash
npm run preview
```

## Vue Features

### Component-based Development
- **App.vue** - Global layout and navigation management
- **HomePage.vue** - Homepage content organization
- All styles are encapsulated in their respective components
- Using Composition API and Options API

### Reactive Data
- Using Vue's reactive system for state management
- Data changes automatically update UI
- Computed properties and watchers

### Event Handling
- Button click event handling
- Component-to-component event communication
- Custom event emission

## Technical Specifications
- Vue 3 Composition API
- ES6+ JavaScript syntax
- CSS3 modern layout techniques
- Responsive design
- Accessibility support
- Cross-browser compatibility

## Usage Instructions
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development server
3. Visit `http://localhost:3000` in your browser
4. Place image resources in `public/images/` directory
5. Website uses component-based design for easy maintenance and extension

## Deployment

### Build Production Version
```bash
npm run build
```

### Deploy to Web Server
1. Deploy the entire `dist/` directory to your web server
2. Ensure image resources are properly placed
3. Make sure your web server serves static files with correct MIME types


### Common Deployment Issues & Solutions

#### Issue 1: CSS Files Not Loading (MIME Type Error)
**Problem**: CSS files are served with `text/plain` MIME type instead of `text/css`
**Solution**: 
- Configure your web server to serve `.css` files with `text/css` MIME type
- For Apache: Add `AddType text/css .css` to `.htaccess`
- For Nginx: Ensure `text/css` is in the MIME types configuration

#### Issue 2: 404 Errors for JavaScript/CSS Files
**Problem**: Files are not found due to incorrect base path configuration
**Solution**: 
- Make sure `base: '/'` is set correctly in `vite.config.js`
- Ensure all files in `dist/assets/` are uploaded to the server
- Check that file names match exactly (including hash suffixes)

#### Issue 3: White Screen on Load
**Problem**: JavaScript files fail to load or execute
**Solution**:
- Check browser console for specific error messages
- Verify all assets are uploaded correctly
- Ensure JavaScript files are served with correct MIME type (`application/javascript`)

#### Issue 4: CORS Proxy Errors in Image Detection
**Problem**: Image detection fails with 403 Forbidden errors from CORS proxy services
**Solution**: 
- The application now uses multiple CORS proxy services as fallback options
- Services include: allorigins.win, corsproxy.io, thingproxy.freeboard.io, and cors-anywhere.herokuapp.com
- If all proxies fail, users will see a friendly error message instead of technical errors
- The system automatically tries each proxy service in sequence until one succeeds

### Render.com Deployment Notes

#### Step-by-step Render Deployment:

1. **Connect Repository**: Link your GitHub repository to Render
2. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Node Version: 18 or latest

3. **Environment Variables**:
   - Go to your service's "Environment" tab in Render dashboard
   - Add: `VITE_GOOGLE_MAPS_API_KEY` with your Google Maps API key
   - Add: `VITE_API_BASE_URL` (optional, defaults to `http://3.106.197.188:8080`)

4. **Deploy**: Click "Manual Deploy" or push to your connected branch

#### Common Render Deployment Issues:

**Issue**: "Error loading tree data" on deployed site
- **Cause**: Backend API server issues or network connectivity
- **Solution**: Ensure backend API server is running and accessible

**Issue**: Blank map or Google Maps errors  
- **Cause**: Missing or invalid Google Maps API key
- **Solution**: Verify `VITE_GOOGLE_MAPS_API_KEY` is set in Render environment variables

**Issue**: Network errors in production
- **Cause**: Backend API server issues or firewall blocking
- **Solution**: Ensure backend API server allows external requests

### API Configuration

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select existing one
3. Enable the "Maps JavaScript API"
4. Create credentials (API Key)
5. Set up environment variable: `VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key`

#### Environment Variables
Create a `.env` file in the project root:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_BASE_URL=http://3.106.197.188:8080
VITE_APP_PASSWORD=123456
```

**For Render.com deployment**, set these environment variables in your Render dashboard:
- `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps JavaScript API key
- `VITE_API_BASE_URL` (optional): Backend API URL with protocol

**Important**: Replace `your_google_maps_api_key` with your actual Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)

## Component Description

### App.vue
- **Responsibility**: Global layout and navigation management
- **Contains**: Navigation bar, main content area, footer
- **Features**:
  - Uses flexbox layout to ensure footer stays at bottom
  - Built-in navigation bar and footer, no additional components needed
  - Responsive design, mobile-friendly

### HomePage.vue
- **Responsibility**: Homepage content organization
- **Contains**: Hero section, features section, info section
- **Features**:
  - All homepage content integrated in one component
  - Uses emoji icons, no external image resources needed
  - Responsive design and animation effects
  - Event handling and interactive features

## Advantages
- **Simplified Structure**: Only 2 main components, easy to maintain
- **Self-contained Styles**: Each component contains its own styles
- **No External Dependencies**: No dependency on external image resources
- **Responsive Design**: Adapts to various screen sizes
- **Modern Development**: Uses Vue 3 and Vite
