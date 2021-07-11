import React, { useContext } from 'react';
import { Router, Redirect } from '@reach/router';
import { Context } from '../utils/Context';
import Home from '../components/Home';
import Login from '../components/Login';
import Error from './Error';
import Signin from '../components/Signin';
import Forgot from '../components/Forgot';

const Routes = () => {
    const { checkUser } = useContext(Context);

    return (
        <Router>
        {(checkUser().IdUser) !== null ? 
            <Home path="/" user={checkUser().IdUser}>
                {/* <Redirect from="/" to="/login"/> */}
            </Home>
            :
            <Login path="/" />
        }
            <Signin path="/signin">
                {(checkUser().IdUser) ? 
                    <Redirect from="/signin" to="/" />
                    :
                    <Redirect from="/signin" to="/" />
                } 
            </Signin>
            <Forgot path="/forgot" />
            <Error default/>
    </Router>
    );
            // <Router
            //     path="/signin"
            //     strict
            //     sensitive
            //     render={() => {
            //         if(!userid){
            //             return <Signin />
            //         }else{
            //             return <Redirect from="/signin" to="/" />
            //         }
            //     }}
            // />  
            // <Route 
            //     path='/' 
            //     render={() => {
            //         if(!userid){
            //             return <Login/>
            //         }else if(userid){
            //             return <Home user={userid}/>
            //         }else{
            //             return <Redirect from="/" to="/login"/>
            //         }
            //     }}
            // />
            // <Route component={Error}/> 
};

export default Routes;
