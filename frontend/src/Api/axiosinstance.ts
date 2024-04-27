import axios from 'axios';


const USERAPI = import.meta.env.VITE_USERAPI;
const ADMINAPI = import.meta.env.VITE_ADMINAPI;
const VENDORAPI = import.meta.env.VITE_VENDORAPI;
const CONVERSATIONAPI = import.meta.env.VITE_CHATAPI;
const MESSAGEAPI = import.meta.env.VITE_MESSAGEAPI;



export const axiosInstance = axios.create({
    baseURL:USERAPI
})
export const axiosInstanceAdmin = axios.create({
    baseURL:ADMINAPI
})
export const axiosInstanceVendor = axios.create({
    baseURL:VENDORAPI
})

export const axiosInstanceChat = axios.create({
    baseURL:CONVERSATIONAPI
})

export const axiosInstanceMsg = axios.create({
    baseURL:MESSAGEAPI
})


 
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('userToken'); 
          
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    

    axiosInstanceAdmin.interceptors.request.use((config) =>{
        const token = localStorage.getItem('adminToken'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstanceVendor.interceptors.request.use((config) =>{
    const token = localStorage.getItem('vendorToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);



    axiosInstance.interceptors.response.use(
        (response) => {
          
            return response;
        },
        async (error) => {
         
            if (error.response.status === 401 && error.response.data.message === 'Invalid token') {
                try {
                    console.log("token expired and error received at axiosinstance");
                    const refreshToken = localStorage.getItem('userrefreshToken');
                   
                    const response = await axiosInstance.post('/refresh-token', { refreshToken });
                   
                    const newToken = response.data.token;
                    
                    localStorage.setItem('userToken', newToken);
    
                   
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return axios(error.config);
                } catch (refreshError) {
                 
                    console.error('Error refreshing token:', refreshError);
                 
                    return Promise.reject(refreshError);
                }
            }
          
            return Promise.reject(error);
        }
    );



    axiosInstanceAdmin.interceptors.response.use(
        (response) => {
            
            return response;
        },
        async (error) => {
            // Handle token refresh logic here
            if (error.response.status === 401 && error.response.data.message === 'Invalid token') {
                try {
                    // Perform token refresh
                    const refreshToken = localStorage.getItem('adminrefreshToken');
                    const response = await axiosInstanceAdmin.post('/refresh-token', { refreshToken });
                    const newToken = response.data.token;
                    localStorage.setItem('adminToken', newToken);

                    // Retry the original request with the new token
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return axios(error.config);
                } catch (refreshError) {
                    // Handle refresh error
                    console.error('Error refreshing token:', refreshError);
                    // Redirect to login page or do other error handling
                    return Promise.reject(refreshError);
                }
            }
            // For other errors, just reject the promise
            return Promise.reject(error);
        }
    );





    axiosInstanceVendor.interceptors.response.use(
        (response) => {
            // Do something with the response data
            return response;
        },
        async (error) => {
            // Handle token refresh logic here
            if (error.response.status === 401 && error.response.data.message === 'Invalid token') {
                try {
                    // Perform token refresh
                    const refreshToken = localStorage.getItem('vendorrefreshToken');
                    const response = await axiosInstanceVendor.post('/refresh-token', { refreshToken });
                    const newToken = response.data.token;
                    localStorage.setItem('vendorToken', newToken);

                    // Retry the original request with the new token
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return axios(error.config);
                } catch (refreshError) {
                    // Handle refresh error
                    console.error('Error refreshing token:', refreshError);
                    // Redirect to login page or do other error handling
                    return Promise.reject(refreshError);
                }
            }
            // For other errors, just reject the promise
            return Promise.reject(error);
        }
    );

