import api from './config';

const clinicAPI = {
    async getClinics() {
        return api.get('/api/clinic/list/all');
    }
}

export default clinicAPI;