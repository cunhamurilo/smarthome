import { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';

export function Auth() {
  
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signInWithGoogle, signInWithEmailAndPassword } = useAuth()

  
    const isLogged = localStorage.getItem("logged") === 'true'
    if(isLogged)
      history.push('/feed')

    async function handleLoginEmailAndPassword(event: FormEvent) {
        event.preventDefault();

        const result = await signInWithEmailAndPassword(email, password);
        if(result !== "Logged"){
          setError(result)
        }else{
          console.log(result)
          setError("")
          history.push('/feed')
        }
    }

    async function handleLoginGoogle(event: FormEvent) {
        event.preventDefault();

        const result = await signInWithGoogle();
        if(result !== "Logged"){
          setError(result)
        }else{
          console.log(result)
          setError("")
          history.push('/feed')
        }
     }

    return (
      <div id="page-auth">
        <main>
          <div className="auth-content">
          
            <strong>Login</strong>

            <form onSubmit={handleLoginEmailAndPassword}>
                <input type="text" placeholder="Email" 
                onChange={event => setEmail(event.target.value)}/>
                <input type="password" placeholder="Password" 
                onChange={event => setPassword(event.target.value)}/>

                <Button type="submit">
                Login
                </Button>
            </form>
            <div className="separator">or</div>

            <div className="customGPlusSignIn" onClick={handleLoginGoogle}>
                <span className="icon"></span>
                <span className="buttonText">Sign in with Google</span>
            </div>

            <p id="error" className="error">{error}</p>
            
          </div>
        </main>
      </div>
    )
  }