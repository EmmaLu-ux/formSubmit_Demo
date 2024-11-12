import httpRequest from "../utils";

export const getFormList = (data) => {
    return httpRequest({
        url: "/form/submit",
        method: "post",
        data,
    });
};

export const getSelectDatas = () => {
    return httpRequest({
        url: "/select/list",
        method: "get",
    })
}

export const portsSelectedDel = (data) => {
    return httpRequest({
        url: '/select/del',
        method: 'delete',
        data
    })
}

export const checkDeviceNumApi = (data) => {
    return httpRequest({
        url: '/select/check',
        method: 'post',
        data
    })
}