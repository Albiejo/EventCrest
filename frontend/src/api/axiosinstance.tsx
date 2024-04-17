import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:'http://localhost:3000/api/user'
})
export const axiosInstanceAdmin = axios.create({
    baseURL:'http://localhost:3000/api/admin'
})
export const axiosInstanceVendor = axios.create({
    baseURL:'http://localhost:3000/api/vendor'
})

export const axiosInstanceChat = axios.create({
    baseURL:'http://localhost:3000/api/conversation'
})

export const axiosInstanceMsg = axios.create({
    baseURL:'http://localhost:3000/api/messages'
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
                    const refreshToken = localStorage.getItem('refreshToken');
                   
                    const response = await axiosInstance.post('/refresh-token', { refreshToken });
                   
                    const newToken = response.data.token;
                    
                    localStorage.setItem('userToken', newToken);
    
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



    axiosInstanceAdmin.interceptors.response.use(
        (response) => {
            // Do something with the response data
            return response;
        },
        async (error) => {
            // Handle token refresh logic here
            if (error.response.status === 401 && error.response.data.message === 'Invalid token') {
                try {
                    // Perform token refresh
                    const refreshToken = localStorage.getItem('refreshToken');
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
                    const refreshToken = localStorage.getItem('refreshToken');
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

