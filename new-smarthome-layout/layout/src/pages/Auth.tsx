import { useState, FormEvent, SyntheticEvent } from 'react';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';

export function Auth() {
  
    const [error, setError] = useState('');
    const { signInWithGoogle, signInWithEmailAndPassword } = useAuth()
  
    // function get email and password for login
    async function handleLoginEmailAndPassword(event: SyntheticEvent) {
        event.preventDefault();
        const target = event.target as typeof event.target & {
          email: { value: string };
          password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;
        const result = await signInWithEmailAndPassword(email, password);

        if(result !== "Logged")
          setError(result)
    }

    // function that get click in google button
    async function handleLoginGoogle(event: FormEvent) {
        event.preventDefault();

        const result = await signInWithGoogle();
        if(result !== "Logged"){
          setError(result)
        }else{
          console.log(result)
          setError("")
        }
     }

    return (
      <div id="page-auth">
        <main>
          <div className="auth-content">
          
            <strong>Login</strong>

            <form onSubmit={handleLoginEmailAndPassword}>
                <input type="text" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />

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