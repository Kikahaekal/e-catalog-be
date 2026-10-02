import { Router } from "express";
import { createRegency, deleteRegency, editRegency, getAllRegencies, getRegencies } from "../controller/regencyController";

const router = Router();

router.post('/', createRegency);
router.put('/:regencyId', editRegency);
router.delete('/:regencyId', deleteRegency);
router.get('/:regencyId', getRegencies);
router.get('/', getAllRegencies);

export default router;
