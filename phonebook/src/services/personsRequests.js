import axios from 'axios';

const url = '/api/persons';

const getAll = async () => {
    const request = await axios.get(url);
    const response = request.data;

    return response;
};

const create = async (newPerson) => {
    const request = await axios.post(url, newPerson);
    const response = request.data;

    return response;
};

const update = async (id, updatePerson) => {
    const request = await axios.put(`${url}/${id}`, updatePerson);
    const response = request.data;

    return response;
}

const erase = async (id) => {
    const request = await axios.delete(`${url}/${id}`);
    const response = request.data;

    return response;
}



export default {
    getAll,
    create,
    update,
    erase
}