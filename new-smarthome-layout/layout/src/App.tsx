import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from "./pages/Feed";
import { Auth } from "./pages/Auth";
import { Loading } from "./pages/Loading";
import { useState } from 'react';

import { AuthContextProvider } from './contexts/AuthContext';

type User = {
  id: string;
  name: string;
  avatar: string;
}


function App(){
  const [user, setUser] = useState<User>({id:'', name:'', avatar:''});
  
  // function redirect to specific layout
  function handleUserConnected(user:User, from:string) {
    if (user.id === '') {
      return <Loading />;
    }else if(user.id === 'null'){
      if(from !== 'auth')
        return <Redirect to="auth"/>
      else
        return <Auth />;
    }else{
      if(from !== 'feed')
        return <Redirect to="feed"/>
      else
        return <Feed />;
    }
  }
  
  return (
    <BrowserRouter>
      <AuthContextProvider user={user} setUser={setUser}>
        <Switch> 
            <Route exact path="/"  > 
              { handleUserConnected(user, '/') }
            </Route>
            <Route exact path="/auth"  > 
              { handleUserConnected(user, 'auth') }
            </Route>
            <Route exact path="/feed"  > 
              { handleUserConnected(user, 'feed') }
            </Route>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;