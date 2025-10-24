# Task Manager Assignment

## Setup Instructions

You can run this application either with Docker (recommended) or locally without Docker.

### Option 1: Docker Setup (Recommended)

#### Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

#### Quick Start with Docker

1. **Clone the repository** (if you haven't already):
```bash
git clone git@github.com:edwinhnandez/task-mnager.git
cd task-manager
```

2. **Start the application**:
```bash
docker-compose up --build
```

This will:
- Build and start the backend API on `http://localhost:3000`
- Build and start the frontend on `http://localhost:8080`
- Create a network for communication between containers

3. **Access the application**:
   
   Open your browser and visit: **`http://localhost:8080`**

4. **Stop the application**:
```bash
docker-compose down
```

#### Useful Docker Commands

```bash
# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild containers after code changes
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v

# Restart a specific service
docker-compose restart backend
```

#### Docker Architecture

- **Backend Container**: Node.js Express API running on port 3000
- **Frontend Container**: Nginx serving static files on port 8080
- **Network**: Both containers communicate via a Docker bridge network
- **Health Checks**: Automatic health monitoring for both services

---

### Option 2: Local Setup (Without Docker)

#### Prerequisites
- Node.js (v14 or higher)
- A modern web browser

#### Frontend Configuration

First, set up the frontend configuration:

```bash
cd frontend
cp config.example.js config.js
```

(Optional) Edit `config.js` if you need to change the API URL.

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend API will be available at `http://localhost:3000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your browser, or use a simple HTTP server:

**Option A: Using Python:**
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

**Option B: Using Node.js http-server:**
```bash
npx http-server -p 8000

# Then open http://localhost:8000
```

**Option C: Using VS Code:**
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id/complete` | Mark task as completed |
| DELETE | `/tasks/:id` | Delete a task |

### Example API Usage

**Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

**Create a new task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task"}'
```

**Mark task as completed:**
```bash
curl -X PATCH http://localhost:3000/tasks/<task-id>/complete
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/tasks/<task-id>
```

---

## Testing

This project includes comprehensive unit and integration tests.

### Running Tests

**Backend Tests:**
```bash
cd backend
npm install  # If not already installed
npm test     # Run all tests with coverage
```

**Frontend Tests:**
```bash
cd frontend
npm install  # If not already installed
npm test     # Run all tests with coverage
```

### Test Coverage

- Backend: 100% coverage (statements, branches, functions, lines)
- Frontend: 100% coverage (statements, branches, functions, lines)
- 60+ comprehensive tests across all layers

---

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app (testable)
│   │   └── server.js           # Server entry point
│   ├── __tests__/
│   │   └── app.test.js         # API tests
│   ├── node_modules/
│   ├── coverage/               # Test coverage reports
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── taskService.js  # API service layer
│   │   └── composables/
│   │       └── useTasks.js     # Business logic
│   ├── __tests__/
│   │   ├── services/
│   │   │   └── taskService.test.js
│   │   └── composables/
│   │       └── useTasks.test.js
│   ├── node_modules/
│   ├── coverage/               # Test coverage reports
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vitest.config.js        # Test configuration
│   ├── test-setup.js           # Test setup
│   ├── package.json
│   ├── app.js                  # Vue app (CDN)
│   ├── config.js               # API config
│   ├── config.example.js       # Config template
│   ├── index.html
│   └── style.css
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── README.md              # Testing documentation
```

---

## Time Spent

Approximately **2-3 hours** spent on:
- Backend API development (45 minutes)
- Frontend implementation (1 hour)
- Styling and responsiveness (30 minutes)
- Testing and bug fixes (30 minutes)
- Docker configuration (30 minutes)

---

## Design Decisions

### Backend Architecture
- **Express.js**: Lightweight and perfect for a simple REST API
- **In-memory storage**: Sufficient for the assignment scope; would use a database (PostgreSQL/MongoDB) in production
- **UUID**: Better than sequential IDs for distributed systems and security
- **Error handling**: Proper try-catch blocks and meaningful error messages

### Frontend Architecture
- **Vue 3 (CDN)**: No build tools needed, faster development, perfect for small projects
- **Tailwind CSS (CDN)**: Rapid UI development with utility-first classes
- **No state management library**: Overkill for this scope; Vue's reactive data is sufficient
- **API URL configuration**: Using `config.js` for easy environment switching

### UI/UX Decisions
- **Clean, modern interface**: Focused on usability
- **Visual feedback**: Loading states, hover effects, status badges
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Color coding**: Green for completed, yellow for pending tasks
- **Confirmation dialogs**: Prevents accidental deletions

### Docker Strategy
- **Multi-container setup**: Separation of concerns (frontend/backend)
- **Nginx for frontend**: Production-ready static file serving
- **Health checks**: Ensures containers are running properly
- **Bridge network**: Secure container communication
- **Alpine images**: Smaller image sizes for faster deployment

---

## AI Use

### Tools Used
- **GitHub Copilot**: For autocomplete and boilerplate code
- **ChatGPT**: For Docker configuration best practices

### What I Accepted
- Basic Express.js route structure
- Tailwind CSS utility classes suggestions
- Docker health check configurations
- Nginx configuration template

### What I Rejected/Modified
- AI suggested using a database initially - opted for in-memory storage for simplicity
- Modified AI-generated error messages to be more user-friendly
- Simplified Docker Compose configuration from AI suggestion (removed unnecessary volumes)
- Customized UI components instead of using AI-generated generic templates

### Reasoning
AI was helpful for speeding up boilerplate and configuration, but I made sure to understand and customize everything to fit the specific requirements and maintain code quality.

---

## Improvements

If I had more time, I would add:

### Features
- **Task editing**: Allow users to edit task titles
- **Task categories/tags**: Organize tasks by category
- **Due dates**: Add deadlines for tasks
- **Search and filter**: Find tasks quickly
- **Priority levels**: High, medium, low priority tasks
- **Task descriptions**: Add detailed notes to tasks
- **Sorting options**: Sort by date, priority, status

### Technical Improvements
- **Database integration**: PostgreSQL or MongoDB for data persistence
- **Authentication**: User accounts and login system
- **E2E tests**: Playwright or Cypress for end-to-end testing
- **Progressive Web App**: Offline functionality
- **Internationalization**: Multi-language support
- **Analytics**: Track usage patterns
- **Real-time updates**: WebSocket for live collaboration
- **Theme switcher**: Dark mode toggle
- **Performance**: Add caching, lazy loading
- **Security**: Rate limiting, input sanitization, CORS configuration
- **Logging**: Winston or similar for better debugging

### DevOps
- **CI/CD pipeline**: GitHub Actions for automated testing and deployment
- **Monitoring**: Prometheus + Grafana
- **Environment variables**: Proper secrets management
- **Production build**: Minification and optimization
- **Cloud deployment**: Deploy to AWS/GCP/Azure
- **API documentation**: Swagger/OpenAPI

---

## License

This project is part of a technical assessment and is for demonstration purposes only.
