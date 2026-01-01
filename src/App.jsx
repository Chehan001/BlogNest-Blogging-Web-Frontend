import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddBlog from "./pages/AddBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { Component } from "react";



class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2 style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
          Something went wrong while loading this component.
        </h2>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Navbar />
        </ErrorBoundary>

        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            }
          />
          <Route
            path="/add-blog"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AddBlog />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
