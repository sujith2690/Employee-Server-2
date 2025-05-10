import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { addNewEmployee, deleteEmployeeById, employDetails, findEmployees, getAllEmployees, updateEmployDetails } from '../controllers/employeeController.js';



const employeeRoute = express.Router()

employeeRoute.get("/", authMiddleware, getAllEmployees)
employeeRoute.post("/new",authMiddleware, addNewEmployee)
employeeRoute.get("/:id", authMiddleware, employDetails)
employeeRoute.patch("/:id", authMiddleware, updateEmployDetails)
employeeRoute.delete("/:id", authMiddleware, deleteEmployeeById)

employeeRoute.post("/search", authMiddleware,findEmployees)



export default employeeRoute;