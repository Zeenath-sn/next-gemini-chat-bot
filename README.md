# Chat Application Next

A modern, AI-powered chat application built with Next.js, featuring real-time conversations with Google's Gemini AI, Redux state management, and a responsive UI using Tailwind CSS.

## Description

This project is a full-stack chat application that allows users to interact with an AI chatbot powered by Google's Gemini 2.5 Flash model. It includes features like message history, typing animations, and a clean, intuitive interface. The application is built using Next.js 16, React 19, and TypeScript for type safety.

## Features

- **AI-Powered Chat**: Integrated with Google's Gemini AI for intelligent responses
- **Real-time Messaging**: Instant message exchange with typing indicators
- **Message History**: View and manage recent chat sessions
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Markdown Support**: Rendered markdown in AI responses with typing animation
- **State Management**: Redux Toolkit for efficient state handling
- **Comprehensive Testing**: Jest and React Testing Library for unit and integration tests
- **TypeScript**: Full type safety throughout the application

## Tech Stack

### Frontend

- **Next.js 16**: React framework for server-side rendering and routing
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Markdown**: Markdown rendering
- **FontAwesome**: Icons

### Backend

- **Next.js API Routes**: Serverless API endpoints
- **Google Generative AI**: AI model integration

### Development & Testing

- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd chat-application-next
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Google Gemini API key:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Start Chatting**: Type your message in the input field at the bottom and press Enter or click Send.
2. **View History**: Use the left panel to view and select from recent chat sessions.
3. **Delete History**: Click the trash icon in the left panel to clear all chat history.
4. **Responsive Design**: The app works seamlessly on desktop and mobile devices.

## Project Structure

```
chat-application-next/
├── app/                          # Next.js app directory
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for chat functionality
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── Providers.tsx             # Redux provider
├── components/                   # React components
│   ├── ChatFooter/               # Message input component
│   ├── ChatMessages/             # Message display component
│   ├── LeftPanel/                # Chat history sidebar
│   └── TypingMarkdown/           # Animated markdown renderer
├── features/                     # Redux slices and types
│   ├── chatBotInitialState.ts    # Initial state
│   ├── chatBotSlice.ts           # Chat bot reducer
│   ├── store.ts                  # Redux store configuration
│   └── types.ts                  # TypeScript types
├── utils/                        # Utility hooks and functions
│   └── useChatPanel.ts           # Chat panel logic
├── public/                       # Static assets
├── __mocks__/                    # Jest mocks
├── coverage/                     # Test coverage reports
└── [config files]                # ESLint, Jest, Next.js, etc.
```

## API

The application uses a single API endpoint:

- `POST /api/chat`: Accepts a message and returns an AI-generated response using Google's Gemini model.

Request body:

```json
{
  "message": "Your question here"
}
```

Response:

```json
{
  "reply": "AI-generated response"
}
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

The project includes comprehensive tests for:

- React components
- Redux slices
- Custom hooks
- Utility functions

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm test`: Run Jest tests
- `npm run test:coverage`: Run tests with coverage report

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is private and not licensed for public use.

## Acknowledgments

- [Next.js](https://nextjs.org) for the React framework
- [Google Generative AI](https://ai.google.dev) for the AI model
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Redux Toolkit](https://redux-toolkit.js.org) for state management
