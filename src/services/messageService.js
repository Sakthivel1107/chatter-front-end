import api from "../config/config";

export const getMessages = async (receiverId) => {
    try {
        const response = await api.get("/getMessages",{
            params:{receiverId}
        });
        if(response.status === 200)
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}