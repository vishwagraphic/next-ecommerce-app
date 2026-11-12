'use server'

import { signInSchema, signUpSchema, updateProfileSchema } from "../validators"
import { auth, signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import {prisma} from '@/db/prisma'
import {formatError} from '../utils'
import { ShippingAddress } from "@/types"
import { shippingAddressSchema, paymentMethodSchema } from "../validators"
import z from "zod"
import { PAGE_SIZE } from "../constants"
import { revalidatePath } from "next/cache"
import { updateUserSchema } from "../validators"
import { Prisma } from "../generated/prisma/browser"

export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    
    try {
        const user = signInSchema.parse({
            email: formData.get("email"),
            password: formData.get("password")
        })

        console.log("user:", user)

        await signIn("credentials", user)

        return {success: true, message: 'Signed in successfully'}
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        
        return {success: false, message: 'Invalid email or password'}
    }
}

// Sign user out
export async function signOutUser() {
    await signOut()
}

// Sign up a new user
export async function signUpUser(prevState: unknown, formData: FormData) {
    try {
        const userData = signUpSchema.parse({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        })

        const plainPassword = formData.get("password")

        const hashedPassword = hashSync(userData.password, 12)

        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword
            }
        })

        await signIn("credentials", { email: user.email, password: plainPassword })

        return {success: true, message: 'Signed up successfully'}
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }

        console.error("Error signing up:", error)
        return {success: false, message: formatError(error)}
    }
}

export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    if (!user) {
        throw new Error(`User with ID ${userId} not found`)
    }
    return user
}

export async function updateUserAddress(data: ShippingAddress) {
    try{
        const session = await auth()
        const userId = session?.user?.id
        const currentUser = await prisma.user.findFirst({
            where: { id: userId },
        })
        if (!currentUser) {
            throw new Error("User not found")
        }
        const address:any = shippingAddressSchema.parse(data as any)
        await prisma.user.update({
            where: { id: userId },
            data: { address }
        })
        return {
            success: true,
            message: 'User address updated successfully',
        }
    } catch (error) {
        console.error("Error updating user address:", error)
        return {success: false, message: formatError(error)}
    }
}   

export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        const session = await auth()
        const userId = session?.user?.id
        const currentUser = await prisma.user.findFirst({
            where: { id: userId },
        })
        if (!currentUser) {
            throw new Error("User not found")
        }
        const paymentMethod = paymentMethodSchema.parse(data as any)
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { paymentMethod: paymentMethod.type }
        })
        return {
            success: true,
            message: 'User payment method updated successfully',
        }
    } catch (error) {
        console.error("Error updating user payment method:", error)
        return {success: false, message: formatError(error)}
    }
}

export async function updateProfile(name: string, email: string = "vishwa.graphic@gmail.com") {
    try {
        const session = await auth()
        const userId = session?.user?.id
        if (!userId) {
            throw new Error("User not found")
        }
        console.log("userId:", userId)
        const currentUser = await prisma.user.findFirst({
            where: { id: userId },
        })
        console.log("currentUser:", currentUser)
        if (!currentUser) {
            throw new Error("User not found")
        }
        const updatedData = updateProfileSchema.parse({ name, email })
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { name: updatedData.name, email: updatedData.email ?? currentUser.email }
        })
        return {
            success: true,
            message: 'Profile updated successfully',
        }
    } catch (error) {
        console.error("Error updating profile:", error)
        return {success: false, message: formatError(error)}
    }
}

export const getAllUsers = async ({limit=4, page, query}: {limit?: number, page: number, query?: string}) => {
    try {
        const queryFilter = query && query !== "all" ? { 
            name: { contains: query, mode: "insensitive" } as Prisma.StringFilter
        } : {};
        const users = await prisma.user.findMany({
            where: {
                ...queryFilter
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                created_at: 'desc'
            }
        })
        const dataCount = await prisma.user.count()
        return {
            success: true,
            data: users,
            totalPages: Math.ceil(dataCount / limit),
        }
    } catch (error) {
        console.error("Error fetching all users:", error)
        return {success: false, message: formatError(error)}
    }
}

export const deleteUser = async (id: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: { id },
        })
        if (!user) {
            throw new Error("User not found")
        }
        await prisma.user.delete({
            where: { id },
        })
        revalidatePath('/admin/users')
        return {
            success: true,
            message: 'User deleted successfully',
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return {success: false, message: formatError(error)}
    }
}

export const updateUser = async (user: z.infer<typeof updateUserSchema>) => {
    try{
        const updatedData = updateUserSchema.parse(user)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: updatedData.name,
                role: updatedData.role,
            }
        })
        revalidatePath('/admin/users')
        return {
            success: true,
            message: 'User updated successfully',
        }
    } catch (error) {
        console.error("Error updating user:", error)
        return {success: false, message: formatError(error)}
    }
}