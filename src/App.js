// dependencies
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react'

// components
import MenuBar from './components/menuBar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import AuthRoute from './util/authRoute';
import SinglePost from './pages/singlePost'

import { AuthProvider } from './context/auth';

// styles
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const App = (props) => {

  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Switch>
            <Route exact path='/' component={Home} />
            <AuthRoute exact path='/login' component={Login} />
            <AuthRoute exact path='/register' component={Register} />
            <Route exact path='/posts/:postId' component={SinglePost} />
          </Switch>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
