# SpeakEasy - Public Speaking Assistant

SpeakEasy is an AI-powered public speaking assistant designed to help users transform any topic into compelling speaking points using proven frameworks and AI-powered insights.

## Features

### 🎤 Speech Generator
- Transform any topic into structured speaking points
- Two speech types: Impromptu (PREP framework) and Planned Presentation
- Duration control (1-30 minutes)
- Topic suggestions for inspiration
- AI-powered content generation

### 📚 Speaking Tips
- Comprehensive speaking techniques and strategies
- Categorized tips: Preparation, Delivery, Structure, and Confidence
- Proven speaking frameworks (PREP, Problem-Solution-Benefit, Past-Present-Future)
- Quick reference guide for before and during speeches

### 📊 Speech History
- View and manage previously generated speeches
- Statistics dashboard showing speech counts and total minutes
- Copy, regenerate, or delete speeches
- Organized by creation date with search functionality

## Technology Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vite** - Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js 18.x or later (recommended 20.x or later)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── icons/              # SVG icon components
├── layout/             # Layout components (Header, Sidebar, etc.)
├── pages/              # Page components
│   ├── SpeechGenerator.tsx
│   ├── SpeakingTips.tsx
│   └── SpeechHistory.tsx
└── main.tsx           # Application entry point
```

## Design System

The application uses a consistent design system with:

- **Color Palette**: Brand blue (#465fff), success green (#12b76a), and semantic colors
- **Typography**: Outfit font family with clear hierarchy
- **Components**: Consistent spacing, shadows, and interactive states
- **Dark Mode**: Full dark mode support throughout the application

## Key Components

### Speech Generator
- Topic input with suggestions
- Speech type selection (Impromptu vs Planned)
- Duration slider (1-30 minutes)
- Generate button with loading states

### Speaking Tips
- Categorized tips and techniques
- Speaking frameworks with step-by-step guides
- Quick reference sections
- Visual hierarchy with icons and colors

### Speech History
- Statistics dashboard
- Speech list with metadata
- Action buttons (copy, regenerate, delete)
- Empty state handling

## Customization

The application is built with Tailwind CSS and can be easily customized:

1. **Colors**: Update the color palette in `src/index.css`
2. **Typography**: Modify font settings in the CSS variables
3. **Components**: Customize component styles in individual files
4. **Icons**: Add new icons to `src/icons/` directory

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions, please open an issue in the repository.