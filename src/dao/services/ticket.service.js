import TicketRepository from "../repositories/Ticket.repository.js";
import crypto from "crypto";

/**
 * Genera un código aleatorio de ticket
 * @returns {string}
 */
function generateTicketCode() {
	return crypto.randomBytes(6).toString("hex").toUpperCase();
}

class TicketService {
	async generateTicket({ purchaser, amount, products }) {
		const ticket = {
			code: generateTicketCode(),
			purchase_datetime: new Date(),
			amount,
			purchaser,
			products,
		};

		return await TicketRepository.create(ticket);
	}

	async getTicketByCode(code) {
		return await TicketRepository.getByCode(code);
	}

	async getAllTickets() {
		return await TicketRepository.getAll();
	}
}

export default new TicketService();
