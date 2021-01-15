import LoginForm from '../components/LoginForm'
import Navigation from '../components/Navigation'
import './Login.css'

function Login() {
    return (
      <div className="Login">
        <Navigation type="public"/>
        <LoginForm />
      </div>
    );
}

export default Login;
  