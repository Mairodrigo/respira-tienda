import UserRepository from "../repositories/User.repository.js";

class UserService {
	static async getById(id) {
		return UserRepository.getById(id);
	}
}

export default UserService;
