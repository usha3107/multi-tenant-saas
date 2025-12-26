import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getTenantById,
  updateTenant,
  listTenants,
} from "../controllers/tenantController.js";

const router = express.Router();

// Tenant Admin / User Routes
router.get("/tenants/:tenantId", authenticate, getTenantById); // Get tenant details (and stats)
router.put("/tenants/:tenantId", authenticate, updateTenant);   // Update tenant details

// Super Admin Routes
router.get("/tenants", authenticate, listTenants); // List all tenants

export default router;