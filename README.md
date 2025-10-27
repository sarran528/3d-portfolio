# 3D Portfolio Showcase

A modern 3D portfolio built with React Three Fiber, featuring an interactive driving experience with autonomous and manual model.
## 🏗️ Project Structure

```
project-root/
│
├── public/
│   ├── fonts/
│   ├── models/              # .glb / .gltf / textures (structured by type)
│   │   ├── environment/     # Track, terrain, environmental assets
│   │   ├── vehicles/        # Car models and vehicle assets
│   │   ├── buildings/       # Architectural elements
│   │   └── misc/           # Props, decorations, miscellaneous
│
├── src/
│   ├── assets/              # Static imports (icons, images, audio)
│   │   ├── images/
│   │   ├── icons/
│   │   └── sounds/
│
│   ├── components/
│   │   ├── common/          # Generic reusable UI components (buttons, overlays)
│   │   ├── ui/              # UI overlays related to portfolio (menus, loading)
│   │   └── 3d/              # 3D model components (no logic, only JSX + GLTFJSX)
│   │       ├── vehicles/    # Car and vehicle components
│   │       ├── architecture/# Building and architectural components
│   │       ├── environment/ # Track, floor, walls, lighting
│   │       └── props/       # Decorative elements and props
│
│   ├── context/             # React contexts
│
│   ├── hooks/               # Custom hooks (camera, controls, etc.)
│
│   ├── layouts/             # Route/page layout containers
│
│   ├── scenes/              # Logic for different 3D scenes
│   │   ├── HomeScene.tsx    # Main portfolio scene
│   │   ├── AboutScene.tsx   # About section scene
│   │   └── ContactScene.tsx # Contact section scene
│
│   ├── systems/             # ECS-style or logic systems
│   │   └── GameSystem.ts    # Game logic and state management
│
│   ├── state/               # Zustand stores for state management
│   │   └── appStore.ts      # Main application state
│
│   ├── utils/               # Utility functions
│   │   ├── path.ts          # Path interpolation and calculations
│   │   ├── easing.ts        # Animation easing functions
│   │   └── math.ts          # Mathematical utilities
│
│   ├── types/               # TypeScript types
│
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .gitignore
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Features

- **Interactive 3D Environment**: Explore a custom-built 3D world
- **Dual Driving Modes**: 
  - Manual driving with keyboard controls
  - Autonomous driving with waypoint navigation
- **Responsive Design**: Optimized for various screen sizes
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Performance Optimized**: Efficient 3D rendering with React Three Fiber

## 🎮 Controls

### Manual Mode
- **Arrow Keys**: Control the vehicle
- **K/J**: Zoom camera in/out
- **Mouse**: Orbit camera (when in manual mode)

### Autonomous Mode
- Vehicle automatically follows waypoints
- Smooth path interpolation
- Automatic camera following

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Three Fiber** - 3D rendering
- **React Three Cannon** - Physics simulation
- **React Three Drei** - 3D utilities and helpers
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3d-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏃‍♂️ Development

### Adding New 3D Models

1. Place your `.glb` files in the appropriate `public/models/` subdirectory:
   - `environment/` for tracks, terrain, etc.
   - `vehicles/` for cars, bikes, etc.
   - `buildings/` for architectural elements
   - `misc/` for props and decorations

2. Create a new component in the corresponding `src/components/3d/` subdirectory

3. Import and use the component in your scene

### Adding New Scenes

1. Create a new scene component in `src/scenes/`
2. Add the scene to your routing or main App component
3. Implement scene-specific logic and interactions

### State Management

The project uses Zustand for state management. Add new stores in `src/state/` and import them where needed.

## 🎨 Customization

### Colors and Styling
- Modify the gradient background in `src/layouts/MainLayout.tsx`
- Update component styles using Tailwind CSS classes
- Customize 3D lighting in scene components

### 3D Environment
- Add new models to the appropriate `public/models/` directories
- Create new 3D components in `src/components/3d/`
- Modify track data in `src/utils/trackData.ts`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Contact

For questions or support, please open an issue on GitHub.
