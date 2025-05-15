import TicketService from "../services/ticket.service.js";

/**
 * Obtener todos los tickets
 */
export const getAllTickets = async (req, res) => {
	try {
		const tickets = await TicketService.getAllTickets();
		res.status(200).json({ status: "success", payload: tickets });
	} catch (error) {
		console.error("Error en getAllTickets:", error.message);
		res
			.status(500)
			.json({ status: "error", message: "Error al obtener los tickets" });
	}
};

/**
 * Obtener ticket por código
 */
export const getTicketByCode = async (req, res) => {
	try {
		const { code } = req.params;
		const ticket = await TicketService.getTicketByCode(code);

		if (!ticket) {
			return res
				.status(404)
				.json({ status: "error", message: "Ticket no encontrado" });
		}

		res.status(200).json({ status: "success", payload: ticket });
	} catch (error) {
		console.error("Error en getTicketByCode:", error.message);
		res
			.status(500)
			.json({ status: "error", message: "Error al obtener el ticket" });
	}
};
