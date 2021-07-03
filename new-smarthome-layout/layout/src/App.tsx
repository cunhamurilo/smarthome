import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from "./pages/Feed";
import { Auth } from "./pages/Auth";

import { AuthContextProvider } from './contexts/AuthContext';

function App(){

  const isLogged = localStorage.getItem("logged") === 'true'

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact render={() => (
            isLogged ? 
            <Redirect to="feed"/>:
            <Redirect to="/auth"/> 
          )} />
          <Route path="/auth" component={Auth} />
          <Route path="/feed" component={Feed} /> 
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;