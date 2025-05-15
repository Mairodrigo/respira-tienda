import { Router } from "express";
import {
	getAllTickets,
	getTicketByCode,
} from "../controllers/ticket.controller.js";

const router = Router();

// Obtener todos los tickets
router.get("/", getAllTickets);

// Obtener un ticket por su código
router.get("/:code", getTicketByCode);

export default router;
