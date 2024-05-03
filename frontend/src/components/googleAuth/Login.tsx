import {GoogleLogin,GoogleLoginResponse ,GoogleLoginResponseOffline} from 'react-google-login';

const clientId = import.meta.env.VITE_CLIENT_ID || '';

const Login = () => {

    const onSuccess=(res: GoogleLoginResponse | GoogleLoginResponseOffline)=>{
        if('profileObj' in res){
            console.log("login successfull , user is-" , res.profileObj);
        }else{
            console.log("login successfully : ", res);
            
        }
    }


    const onFailure=(res: GoogleLoginResponse | GoogleLoginResponseOffline)=>{
       
        if('profileObj' in res){
            console.log("login failure some eror occured:" , res.profileObj);
            
        }else{
            console.log("login failure occured:" , res);
            
        }
    }

  return (

        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText='Login'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />

        </div>
  )
}

export default Login