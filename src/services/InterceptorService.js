import axiosInstance from "@/services/ApiService";
import tokenService from "@/services/TokenService";
import TokenService from "@/services/TokenService";

const setup = ()=>{
    axiosInstance.interceptors.request.use(
        (config)=>{
            const token = tokenService.getLocalAccessToken();
            if (token) {
                // config.headers["x-access-token"] = token;
                config.headers["Authorization"] = token;
            }
            return config;
        },
        (error)=>{
            return Promise.reject(error)
        }
    )
    axiosInstance.interceptors.response.use(
        (res)=>{
            return res
        },
        async (err) => {
            const originalConfig = err.config;
            if (originalConfig.url !== "/login" && err.response){
                if (err.response.status === 401 && !originalConfig._retry){
                    originalConfig._retry = true;
                    try{
                        const rs = await axiosInstance.post("/refreshToken", {
                            refreshToken: TokenService.getLocalRefreshToken(),
                        });
                        const {token} = rs.data;
                        TokenService.updateLocalAccessToken(token);
                        return axiosInstance(originalConfig)
                    } catch (_error){
                        return Promise.reject(_error)
                    }
                }
            }
            return Promise.reject(err);
        }
    )
}

export default setup;