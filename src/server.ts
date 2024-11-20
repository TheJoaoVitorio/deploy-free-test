import express from 'express'
import { prismaClient } from './database'

const app = express()
app.use(express.json())

const port = process.env.PORT ?? 4000

app.get('/projetos/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const intId = parseInt(id);

      if (isNaN(intId)) {
          return res.status(400).json({ error: "ID deve ser um número válido" });
      }

      const projectExists = await prismaClient.Project.findUnique({
          where: { id: intId }
      });

      if (!projectExists) {
          return res.status(404).json({ error: "Projeto não encontrado" });
      }

      // Atualiza as views do projeto
      const updateViewsProject = await prismaClient.Project.update({
          where: { id: intId },
          data: {
              views: projectExists.views + 1
          }
      })

      return res.status(200).json(projectExists);

  } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
  }
});


app.listen(port, () => console.log('Server is running on port ', port))
