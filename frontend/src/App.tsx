import "./App.css";
import Header from "./components/Header";
import { ThemeProvider } from "./components/theme-provider";
function App() {
  return (
    <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
      <section className="poppins-regular">
        <div>
          <Header />
        </div>
        
      </section>
    </ThemeProvider>
  );
}

export default App;
