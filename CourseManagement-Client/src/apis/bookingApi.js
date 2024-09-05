import axiosClient from "./axiosClient";

const bookingApi = {
    async bookCourt(data) {
        const url = '/booking/book';
        try {
            const response = await axiosClient.post(url, data);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getBookingHistory(userId) {
        const url = `/booking/history/${userId}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateBookingStatus(data, id) {
        const url = `/booking/${id}/update-status`;
        try {
            const response = await axiosClient.put(url, data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async getBookingByCourt(court_id) {
        const url = `/booking/court/${court_id}`;
        try {
            const response = await axiosClient.get(url);
            console.log(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    
};

export default bookingApi;
