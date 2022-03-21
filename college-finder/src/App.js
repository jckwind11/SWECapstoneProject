import './App.css';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <header className="App-header">
        <i class="material-icons school">school</i>
        <br/><br/>
        <h1>Welcome to College Finder</h1>
        <button class="Sign-Up-Button">Sign Up</button>
        <h2>or</h2>
        <span> Already have an account? <button class="Login-Button">Login</button></span>
      </header>
    </div>
  );
}

export default App;
