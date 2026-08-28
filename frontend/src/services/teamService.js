import api from './api';

const teamService = {
  getTeamWorkload: () => api.get('/team/workload'),
};

export default teamService;
