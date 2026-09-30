import { Router } from "express";
import { createRegency, deleteRegency, editRegency, getAllRegencies, getRegencies } from "../controller/regencyController";

const router = Router();

router.post('/', createRegency);
router.put('/:iucnId', editRegency);
router.delete('/:iucnId', deleteRegency);
router.get('/:iucnId', getRegencies);
router.get('/', getAllRegencies);

export default router;
