import Ticket from "../../models/Ticket.model.js";

class TicketRepository {
	async create(ticketData) {
		return Ticket.create(ticketData);
	}

	async getByCode(code) {
		return Ticket.findOne({ code }).populate("products.productId");
	}

	async getAll() {
		return Ticket.find().populate("products.productId");
	}
}

export default new TicketRepository();
