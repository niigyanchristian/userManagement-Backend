import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import associateModels from './models/associateModels';
import authRoutes from './routes/auth';
import magicLinkRoutes from './routes/MagicLinkRoutes';
import organizationRoutes from './routes/OrganizationRoutes';
import postRoutes from './routes/Post';
import sequelize from './config/database';
import userRoutes from './routes/UserRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));

// Routes
app.use('/api/magic-links', magicLinkRoutes);
app.use(authenticateToken);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/organization', organizationRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to user-management api");
});

// Handle 404 Errors
app.use((req: Request, res: Response) => {
    res.json({ message: 'Endpoint Not Found:(' });
});

// Error Handler Middleware
app.use(errorHandler);

// Database Synchronization
(async () => {
    try {
        associateModels();

        await sequelize.sync({ force: false });

        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to synchronize database:', error);
        process.exit(1);
    }
})();

process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing database connection...');
    await sequelize.close();
    process.exit(0);
});
