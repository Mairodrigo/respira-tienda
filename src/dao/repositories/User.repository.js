import User from "../../models/User.model.js";

class UserRepository {
	static async getById(id) {
		return User.findById(id).lean(); 
	}
}

export default UserRepository;
