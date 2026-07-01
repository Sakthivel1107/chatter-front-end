import api from "../config/config";

export const sendMail = async (mail) => {
    try {
        const response = await api.post("/mail",mail);
        return response;
    } catch (error) {
        throw new Error(error);
    }
}