import { Router } from "express"
import { createWpp,deleteWpp, editWpp, getAllWpp, getWpp } from "../controller/wppController"

const router = Router();

router.post('/', createWpp);
router.put('/:iucnId', editWpp);
router.delete('/:iucnId', deleteWpp);
router.get('/:iucnId', getWpp);
router.get('/', getAllWpp);

export default router;