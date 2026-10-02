import { Router } from "express";
import { getSpecies, createSpecies, deletesSpecies, editSpecies, getAllSpecies } from "../controller/speciesController";

const router = Router();

router.post('/', createSpecies);
router.put('/:speciesId', editSpecies);
router.delete('/:speciesId', deletesSpecies);
router.get('/:speciesId', getSpecies);
router.get('/', getAllSpecies);

export default router;