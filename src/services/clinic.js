import api from './config';

const clinicAPI = {
    async getClinics() {
        return api.get('/api/clinic/list/all');
    },
    async searchClinics(keywords) {
        return api.post('/api/clinic/search', { keywords });
    }
}

export default clinicAPI;