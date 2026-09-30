import { Router } from "express";
import { getSpecies, createSpecies, deletesSpecies, editSpecies, getAllSpecies } from "../controller/speciesController";

const router = Router();

router.post('/', createSpecies);
router.put('/:iucnId', editSpecies);
router.delete('/:iucnId', deletesSpecies);
router.get('/:iucnId', getSpecies);
router.get('/', getAllSpecies);

export default router;