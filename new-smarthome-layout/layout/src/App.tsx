import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from "./pages/Feed";
import { Auth } from "./pages/Auth";

import { AuthContextProvider } from './contexts/AuthContext';

function App(){

  const isLogged = localStorage.getItem("logged") === 'true'
  console.log(isLogged, typeof(isLogged))
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact render={() => (
            <Redirect to="/auth"/> 
          )} />
          <Route path="/auth" component={Auth} render={() => (
            isLogged &&
              (<Route path="/feed" component={Feed} /> )
          )}/>
          <Route path="/feed" component={Feed} /> 
          {/* render={() => (
            !isLogged ?
            <Redirect to='/auth' />:
              <Route path="/feed" component={Feed} />
          )} /> */}
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;