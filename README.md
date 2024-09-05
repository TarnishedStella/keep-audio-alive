# Keep Audio Alive

This is yet another application to prevent your audio devices from going to sleep resulting in missed notifications or worse, crackling noises.

## Key Features

- **Device Selection**: Choose specific audio devices to keep awake.
- **Configurable Idle Detection**: Automatically pauses the audio file when idle, allowing Bluetooth headsets to power down when not in use.
- **State Persistence**: Remembers the previous application state for a seamless experience.
- **System Tray Control**: Quickly pause or resume the application from the system tray.
- **Automatic Updates**: Stay up-to-date with the latest features and improvements.

The application is built using Electron and leverages the HTML5 audio player to play a silent audio file on selected devices. This approach prevents devices from powering down without generating any noticeable noise or static. Each active device is managed independently, ensuring fine-grained control.

### Why Electron???
Short answer: because I wanted to!

Long answer: To sharpen my skills and get better using web development frameworks like vite + react since im generally a backend developer. It also is a pretty nice framework to build cross platform applications that actually look nice and aren't a complete headache to get going. Ive actually built a very similar application using dotnet and winforms, but it was such a hassle to get anything decent looking using xaml. It was a breathe of fresh air to actually build a desktop app using css as crazy as that sounds. The obvious trade off here being that the executable and running resources are larger than using another lighter weight framework. interestingly in comparison this app hovered consistently around 100mb of ram while the dotnet winforms version used about 50mb spiking to 80mb when using the tray so the difference wasn't _that_ large.

## Installation

Download and install the latest version from the [Releases Page](https://github.com/TarnishedStella/keep-audio-alive/releases/latest).

## Automatic Updates

Keep Audio Alive will automatically check for updates upon startup and every 12 hours. You will be notified if an update is available.

## Screenshots

### Home Screen
![screenshot](/docs/images/Application%20Screenshot%20-%20Home.png)

### Settings
![screenshot](/docs/images/Application%20Screenshot%20-%20Settings.png)

## Development

### Recommended IDE Setup

- **[VSCode](https://code.visualstudio.com/)**: A lightweight, versatile editor.
- **[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)**: For identifying and fixing code quality issues.
- **[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)**: For consistent code formatting.

### Prerequisites

- **Node.js**: Version 20.16.0 or higher.
- **Yarn**: Enable Yarn using `corepack enable`.

### Project Setup

1. **Install dependencies**:

   ```bash
   yarn install
   ```
1. Launch Development Build

    ```bash
    yarn dev
    ```

1. Build a Bundled Executable + Installer
    - For Windows
      ```bash
      yarn build:win
      ```
    - For macOS
      ```bash
      yarn build:mac
      ```
    - For Linux
      ```bash
      yarn build:Linux
      ```
## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request. Please ensure your code follows the existing style and passes all linting checks.

## License
Keep Audio Alive is licensed under the MIT License. Feel free to use, modify, and distribute this software as you see fit.
