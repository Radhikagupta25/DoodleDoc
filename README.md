# 🎨 DoodleDoc

A feature-rich online whiteboard built with **React**, **Konva**, **Zustand**, and **Tailwind CSS**. DoodleDoc allows users to draw, create shapes, add formatted text, edit content, and export their work as an image.

##  Features

###  Drawing Tools

* Pen tool
* Eraser tool
* Adjustable brush size
* Custom color picker

###  Shapes

* Rectangle
* Circle
* Diamond
* Line
* Arrow

###  Text Editing

* Add text anywhere on the canvas
* Edit existing text
* Font family selection
* Font size selection
* Bold text
* Italic text
* Underline text

###  Shape Manipulation

* Drag and move shapes
* Resize shapes using handles
* Select and edit objects

### Actions

* Undo
* Redo
* Delete selected shape/text
* Save whiteboard as image

###  Room-Based Whiteboards

* Unique room IDs
* Room-specific whiteboard persistence
* Copy room ID with one click

###  Persistence

* Automatic saving using Local Storage
* Whiteboard state restored on refresh

---

##  Tech Stack

* **React.js**
* **React Konva**
* **Zustand**
* **Tailwind CSS**
* **Lucide React Icons**
* **Local Storage API**

---

## 📸 Screenshots

### Home Page

```md
![Home](./Screenshots/home-page.png)
```

### Drawing Canvas

```md
![Canvas](./Screenshots/canvas.png)
```

### Login Page

```md
![Shapes](./Screenshots/login-page.png)
```

---

### Signup Page

```md
![Shapes](./Screenshots/signup-page.png)
```

---

### Join Room Page

```md
![Shapes](./Screenshots/join-room-page.png)
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/Radhikagupta25/doodledoc.git
```

Navigate to the project:

```bash
cd doodledoc
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 📁 Project Structure

```text
src/
│
├── components/
│   └── Canvas.jsx
│
├── pages/
│   ├── Home.jsx
│   └── Room.jsx
│
├── store/
│   └── useWhiteboardStore.js
│
├── assets/
│
└── App.jsx
```

---

##  Learning Outcomes

While building DoodleDoc, I explored:

* Canvas-based drawing with React Konva
* State management using Zustand
* Shape rendering and transformations
* Undo/Redo implementation using history stacks
* Local Storage persistence
* Dynamic text editing
* Event handling and canvas interactions
* Exporting canvas content as images

---

##  Future Improvements

* Real-time collaboration
* Multi-user rooms
* Firebase/Socket.IO integration
* Export as PDF
* Dark mode
* Shape color customization
* Custom shape library
* Infinite canvas

---

##  Author

**Radhika Gupta**

B.Tech Computer Science 
Ajay Kumar Garg Engineering College

GitHub: `https://github.com/Radhikagupta25`

---

## ⭐ If you like this project

Consider giving it a star on GitHub!

```bash
⭐ Star the repository
🍴 Fork the repository
🚀 Build upon it
```

