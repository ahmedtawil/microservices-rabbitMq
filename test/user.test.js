const axios = require('axios').default;
const casual = require('casual');
const { errorMessages } = require('../constants');

const BASE_URL = 'http://localhost:3000';
const REGISTER_USER_END_POINT = '/user/register';
const DEACTIVATE_USER_END_POINT = '/user/deactivate';

const createNewUserRequest = async (user) => {
    const res = await axios.post(BASE_URL + REGISTER_USER_END_POINT, user)
    return res;
};

const deactivateUserRequest = async (user) => {
    const res = await axios.post(BASE_URL + DEACTIVATE_USER_END_POINT, user);
    return res;
};

describe('user service', () => {

    test('test server is live', async () => {
        const res = await axios.get(BASE_URL)
        expect(res.status).toBe(200);
    })

    test('test create new user with invalid parameters', async () => {
        const res = await createNewUserRequest({ name: undefined, email: undefined });
        const expectedRes = { success: false, msg: errorMessages.USER.invalidUserParameters };
        expect(res.data).toEqual(expectedRes);
    })

    test('test create new user with correct parameters', async () => {
        const user = {
            name: casual.full_name,
            email: casual.email
        };
        const res = await createNewUserRequest(user);
        expect(res.data.success).toBeTruthy();
    });

    test('test deactivate user with invalid user id parameter', async () => {
        const user = { userID: '' };
        const res = await deactivateUserRequest(user);
        const expectedRes = { success: false, msg: errorMessages.USER.invalidUserID };
        console.log(res.data);
        expect(res.data).toEqual(expectedRes);
    });

    test('test deactivate user with correct user id parameter', async () => {
        const mewUserData = {
            name: casual.full_name,
            email: casual.email
        };
        const res1 = await createNewUserRequest(mewUserData);
        console.log(res1.data);
        const user = { userID: res1.data.user.id };
        const res2 = await deactivateUserRequest(user);
        expect(res2.data.success).toBeTruthy();
    });
});
