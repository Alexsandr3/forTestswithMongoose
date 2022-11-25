import {Request, Response, Router} from "express";


export const authRoute = Router({})


authRoute.post('/login',  async (req: Request, res: Response) => {})
authRoute.post('/password-recovery',  async (req: Request, res: Response) => {})
authRoute.post('/new-password',  async (req: Request, res: Response) => {})
authRoute.post('/refresh-token',  async (req: Request, res: Response) => {})
authRoute.post('/registration-confirmation',  async (req: Request, res: Response) => {})
authRoute.post('/registration',  async (req: Request, res: Response) => {})
authRoute.post('/registration-email-resending',  async (req: Request, res: Response) => {})

authRoute.post('/logout',  async (req: Request, res: Response) => {})
