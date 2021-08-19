import { useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { Feed } from "./pages/Feed";
import { Auth } from "./pages/Auth";
import { Loading } from "./pages/Loading";
import { Error } from "./pages/Error";

import SlideBar from "./components/SlideBar/SlideBar"

import { AuthContextProvider } from './contexts/AuthContext';

type User = {
  id: string;
  name: string;
  avatar: string;
}

function App(){
  const [toggled, setToggled] = useState({toggled:false, collapsed:true});
  const [user, setUser] = useState<User>({id:'', name:'', avatar:''});

  const urls = ['/feed']
  const menus = [ 'Feed']
  
  // function redirect to specific layout
  function handleUserConnected(user:User, from:string) {
    const indexUrl = urls.findIndex((url) => url.toLowerCase() === from.toLowerCase())
    if (user.id === '') {
      if (indexUrl > -1 || from === '/' || from === '/auth')
        return <Loading />;
      else
        return <Redirect to='error' />
    }else if(user.id === 'null'){
      if(indexUrl > -1 || from === '/')
        return <Redirect to="auth"/>
      else if(from === '/auth' )
        return <Auth />;
      else 
        return <Redirect to='error' />
    }else{
      switch(from){
        case '/feed':
          return <Feed handleToggleSidebar={handleToggleSidebar}/>;
        case '/':
        case '/auth':
          return <Redirect to="feed"/>
        default:
          return <Redirect to='error' />
      }
    }
  }
 
  // função que ativao side bar
  function handleToggleSidebar (value:boolean) {
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
              { handleUserConnected(user, '/auth') }
            </Route>
            <Route exact path="/error" component={Error} />
            { 
              (window.location.pathname !== '/' && window.location.pathname !== '/auth' &&  
                urls.findIndex((url) => url.toLowerCase() === window.location.pathname.toLowerCase()) === -1 ) &&
                <Route path={window.location.pathname} exact> 
                  { handleUserConnected(user, window.location.pathname) }
                </Route>
            }
            <Route>
              <div className="App">
              { 
                (user.id !== 'null' && user.id !== '') &&
                <SlideBar 
                  toggled={toggled.toggled}
                  collapsed={toggled.collapsed}
                  urls={urls}
                  menus={menus}
                  handleToggleSidebar={handleToggleSidebar}
                />
              }
              <main className={(window.location.pathname !== '/' && user.id === '') ? 'main-loading': 'main-app'} >  
                {urls.map((url,index) => {
                  return <Route key={index} path={url} exact> 
                    { handleUserConnected(user, url) }
                  </Route>
                })}
              </main>
              </div>
            </Route>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;