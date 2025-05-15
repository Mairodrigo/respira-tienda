import UserRepository from "../repositories/user.repository.js";

class UserService {
	static async getById(id) {
		return UserRepository.getById(id);
	}
}

export default UserService;
