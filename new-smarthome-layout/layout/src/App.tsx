import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from "./pages/Feed";
import { Auth } from "./pages/Auth";
import { Loading } from "./pages/Loading";
import SlideBar from "./components/SlideBar/SlideBar"
import { useState } from 'react';

import { AuthContextProvider } from './contexts/AuthContext';

import { FaBars } from 'react-icons/fa';

type User = {
  id: string;
  name: string;
  avatar: string;
}

function App(){
  const [toggled, setToggled] = useState({toggled:false, collapsed:true});
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
  
 
  // função que ativao side bar
  function handleToggleSidebar (value:boolean) {
    console.log(value)
    setToggled({toggled:value, collapsed:value? false:true});
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

            <Route>
              <div className="App">
              { 
              (user.id !== 'null' && user.id !== '') &&
                <>
                  <SlideBar 
                    toggled={toggled.toggled}
                    collapsed={toggled.collapsed}
                    handleToggleSidebar={handleToggleSidebar}
                  />
                  <div className="toggle">     
                    <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                      <FaBars />
                    </div>
                  </div>
                </>
              }
              <main className="main-app">  
                <Route exact path="/feed"  > 
                  { handleUserConnected(user, 'feed') }
                </Route>
              </main>
              </div>
            </Route>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;