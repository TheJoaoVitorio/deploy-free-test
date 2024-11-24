import express from 'express';
import cors from 'cors';
import { prismaClient } from './database';

const app = express();
app.use(express.json());

const port = process.env.PORT ?? 4000;

// Configuração de CORS
app.use(cors({
    origin: 'https://joaovitoriodev.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// GET Projetos
app.get('/projetos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const intId = parseInt(id);

        if (isNaN(intId)) {
            return res.status(400).json({ error: "ID deve ser um número válido" });
        }

        const projectExists = await prismaClient.project.findUnique({
            where: { id: intId }
        });

        if (!projectExists) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        // Atualiza as views do projeto
        const updateViewsProject = await prismaClient.project.update({
            where: { id: intId },
            data: {
                views: projectExists.views + 1
            }
        });

        return res.status(200).json(projectExists);

    } catch (error) {
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});


// POST Views no Projeto


// POST Likes no Projeto
app.post("/projetos/:id/like", async (req, res) => {
    const { id } = req.params;
    const intId = parseInt(id);

    if (isNaN(intId)) {
        return res.status(400).json({ error: "ID deve ser um número válido" });
    }

    const projectExists = await prismaClient.project.findUnique({
        where: { id: intId }
    });

    if (!projectExists) {
        return res.status(404).json({ error: "Projeto não encontrado" });
    }

    const updateLikesProject = await prismaClient.project.update({
        where: {id:intId},
        data: {
            likes: projectExists.likes + 1
        }
    })

    return res.status(200).json(projectExists);

} )


app.listen(port, () => console.log('Server is running on port ', port));