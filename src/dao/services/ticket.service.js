import TicketRepository from "../repositories/Ticket.repository.js";
import TicketDTO from "../dtos/Ticket.dto.js";
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

		const createdTicket = await TicketRepository.create(ticket);
		return new TicketDTO(createdTicket.toObject());
	}

	async getTicketByCode(code) {
		const ticket = await TicketRepository.getByCode(code);
		return ticket ? new TicketDTO(ticket.toObject()) : null;
	}

	async getAllTickets() {
		const tickets = await TicketRepository.getAll();
		return tickets.map((ticket) => new TicketDTO(ticket.toObject()));
	}
}

export default new TicketService();
