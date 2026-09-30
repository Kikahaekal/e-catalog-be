import { Router } from 'express';
import { createIucn, editIucn, deleteIucn, getIucn, getAllIucn } from '../controller/iucnController.ts';

const router = Router();

router.post('/', createIucn);
router.put('/:iucnId', editIucn);
router.delete('/:iucnId', deleteIucn);
router.get('/:iucnId', getIucn);
router.get('/', getAllIucn);

export default router;