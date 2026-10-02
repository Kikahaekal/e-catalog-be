import { Router } from "express"
import { createWpp,deleteWpp, editWpp, getAllWpp, getWpp } from "../controller/wppController"

const router = Router();

router.post('/', createWpp);
router.put('/:wppId', editWpp);
router.delete('/:wppId', deleteWpp);
router.get('/:wppId', getWpp);
router.get('/', getAllWpp);

export default router;