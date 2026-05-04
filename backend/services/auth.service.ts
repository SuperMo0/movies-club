import { prisma } from '../lib/prisma.ts';
import { hash, compare } from "../lib/bcrypt.ts";
import { appError } from "../errors/appError.ts";
import { isUniqueConstraintError } from "../utils/prismaErrors.util.ts";
import { generateToken } from "../lib/jwt.ts";
import { safeUserResponseSchema, type LoginBody, type SignupBody } from "moviesclub-shared/auth";


export const authService = {
    async login(body: LoginBody) {
        const user = await prisma.user.findUnique({
            where: { username: body.username },
            include: {
                _count: { select: { followedBy: true, following: true } }
            }
        });

        if (!user) {
            throw new appError(401, "invalid credentials");
        }

        const isPassMatches = await compare(body.password, user.password);
        if (!isPassMatches) {
            throw new appError(401, "invalid credentials");
        }

        const safeUser = safeUserResponseSchema.parse(user);
        const token = await generateToken({ id: user.id });

        return { safeUser, token };
    },

    async signup(body: SignupBody) {
        const hashedPassword = await hash(body.password);

        try {
            const user = await prisma.user.create({
                data: {
                    name: body.name,
                    username: body.username,
                    password: hashedPassword,
                },
                include: {
                    _count: { select: { followedBy: true, following: true } }
                }
            });

            const safeUser = safeUserResponseSchema.parse(user);
            const token = await generateToken({ id: user.id });

            return { safeUser, token };

        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new appError(409, 'username already exists');
            }
            throw error;
        }
    },

    async checkAuth(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                _count: { select: { followedBy: true, following: true } }
            }
        });

        if (!user) return null;
        return safeUserResponseSchema.parse(user);
    }
};