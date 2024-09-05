import axiosClient from "./axiosClient";

const userApi = {
    async getAllPersonalInfo() {
        const url = '/auth/getAll';
        try {
            const response = await axiosClient.get(url);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login(taiKhoan, matKhau) {
        const url = '/QuanLyNguoiDung/DangNhap';
        return axiosClient
            .post(url, {
                taiKhoan,
                matKhau,
            })
            .then(response => {
                console.log(response);
                if (response) {
                    localStorage.setItem("token", response.accessToken);
                    localStorage.setItem("user", JSON.stringify(response));
                }
                return response;
            });
    },

    getProfile() {
        const url = '/QuanLyNguoiDung/ThongTinTaiKhoan';
        return axiosClient.post(url);
    },

    updateProfile(data, id) {
        const url = '/QuanLyNguoiDung/CapNhatThongTinNguoiDung';
        return axiosClient.put(url, data);
    },

    forgotPassword(data) {
        const url = '/auth/forgot-password';
        return axiosClient.post(url, data);
    },

    listUserByAdmin(data) {
        const url = '/QuanLyNguoiDung/LayDanhSachNguoiDung';
        return axiosClient.get(url);
    },

    banAccount(data, id) {
        const url = '/user/updateProfile/' + id;
        return axiosClient.put(url, data);
    },

    unBanAccount(data, id) {
        const url = '/user/updateProfile/' + id;
        return axiosClient.put(url, data);
    },

    searchUser(email) {
        console.log(email);
        const params = {
            tuKhoa: email.target.value
        }
        const url = `/QuanLyNguoiDung/TimKiemNguoiDung?MaNhom=GP08`;
        return axiosClient.get(url, { params });
    },

    sendNotification(data) {
        console.log(data);
        const url = '/auth/notifications';
        return axiosClient.post(url, data);
    },

    createNotificationByEmail(data) {
        console.log(data);
        const url = '/notifications/createNotificationByEmail';
        return axiosClient.post(url, data);
    },

    listNotification() {
        const url = '/notifications';
        return axiosClient.get(url);
    },

    xoaNguoiDung(TaiKhoan) {
        const url = `/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${encodeURIComponent(TaiKhoan)}`;
        return axiosClient.delete(url);
    }
    

    

}

export default userApi;