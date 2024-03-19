import {GoogleLogout} from 'react-google-login';


const clientId =  import.meta.env.VITE_CLIENT_ID || '';

const Logout=()=>{

    const onSuccess = () => {
        console.log("Google Logout done...");
        
    }


return (
    <div id="signInButton">
    <GoogleLogout
        clientId={clientId}
        buttonText='Logout'
        onLogoutSuccess={onSuccess}
    />

</div>
)

}

export default Logout;