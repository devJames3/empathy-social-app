# Instagram API Integration Project

This project implements a web application that integrates with the Instagram API to display user information and enable comment interactions on Instagram media.

## Project Overview

This application allows users to:

1. Login with their Instagram account
2. View their profile information
3. Browse their media feed
4. View and interact with comments on their posts

## Features

- **Instagram Authentication**: Secure OAuth implementation for Instagram login
- **Profile Information Display**: Shows user details fetched from Instagram
- **Media Feed**: Displays the user's Instagram posts in a responsive grid
- **Comment System**:
  - View comments on media items
  - Reply to existing comments
  - Post new comments on media
  - Comment overlay UI that appears over the media without disrupting page flow

## Technical Implementation

### Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS for styling
- **State Management**: React Hooks for local state management
- **API Integration**: Custom hooks to interact with Instagram Graph API

### API Integration Notes

Due to Instagram API limitations, the comment fetching functionality is restricted to:

- Accounts with proper policy URL configuration

Only posting of comments is achieved in the solution for now, but will scale.

## Installation and Setup

1. Clone the repository:

   ```
   git clone https://github.com/devJames3/empathy-social-app.git
   cd empathy-social-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with your Instagram API credentials:

   ```
   NEXTAUTH_SECRET=

    INSTAGRAM_APP_ID=your-instagram-app-ID
    INSTAGRAM_APP_SECRET=your-instagram-app-secrete
    NEXT_PUBLIC_BASE_URL=https://redirectmeto.com/http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Configuration Requirements

To use this application with the Instagram API:

1. Create an Instagram Developer account
2. Register a new application in the Meta for Developers portal
3. Configure the following permissions:
   - `user_profile`
   - `user_media`
   - `instagram_basic`
4. Add your redirect URI to the app settings

## Usage

1. Open the application in your browser
2. Click "Login with Instagram"
3. Authorize the application's requested permissions
4. Browse your profile information and media
5. Click on "Comments" on any media item to view and interact with comments

## License

MIT License
