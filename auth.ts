import NextAuth from 'next-auth'
import {PrismaAdapter} from '@auth/prisma-adapter'
import {prisma} from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'
import { authConfig } from '@/auth.config'
import { cookies } from 'next/dist/server/request/cookies'
import { round2 } from '@/lib/utils'
import type { CartItem } from '@/types'

export const config = {
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                // Add your authentication logic here
                if (credentials === null) return null
                console.log("credentials:", credentials)
                const user = await prisma.user.findFirst({
                    where: { email: credentials.email as string }
                })
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password)
                    if (isMatch) {
                        return { id: user.id, email: user.email, name: user.name, role: user.role }
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, user, trigger, token } : any) {
            
            session.user.id = token.sub
            session.user.role = token.role
            session.user.name = token.name

            if(trigger === 'update'){
                session.user.name = token.name
                session.user.email = token.email
                session.user.role = token.role
            }

            return session
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                token.id = user.id
                token.role = user.role
                if(user.name === "NO_NAME"){
                    token.name = user.email.split('@')[0]

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: user.email.split('@')[0] }
                    })
                }
                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies()
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value

                    if (sessionCartId) {
                       const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId }
                        })
                        if (sessionCart) {
                            await prisma.$transaction(async (transaction) => {
                                const userCart = await transaction.cart.findFirst({
                                    where: { userId: user.id }
                                })

                                if (!userCart || userCart.id === sessionCart.id) {
                                    await transaction.cart.update({
                                        where: { id: sessionCart.id },
                                        data: { userId: user.id }
                                    })
                                    return
                                }

                                const mergedItems = [...userCart.items as CartItem[]]
                                for (const guestItem of sessionCart.items as CartItem[]) {
                                    const existingItem = mergedItems.find(
                                        (item) => item.productId === guestItem.productId
                                    )
                                    if (existingItem) {
                                        existingItem.qty += guestItem.qty
                                    } else {
                                        mergedItems.push(guestItem)
                                    }
                                }

                                const itemsPrice = round2(
                                    mergedItems.reduce((sum, item) => sum + Number(item.price) * item.qty, 0)
                                )
                                const shippingPrice = round2(itemsPrice > 100 ? 0 : 100)
                                const taxPrice = round2(itemsPrice * 0.15)

                                await transaction.cart.update({
                                    where: { id: userCart.id },
                                    data: {
                                        items: mergedItems as any,
                                        itemsPrice: itemsPrice.toFixed(2),
                                        shippingPrice: shippingPrice.toFixed(2),
                                        taxPrice: taxPrice.toFixed(2),
                                        totalPrice: round2(itemsPrice + shippingPrice + taxPrice).toFixed(2)
                                    }
                                })

                                await transaction.cart.delete({
                                    where: { id: sessionCart.id }
                                })
                            })
                        }
                    }
                }
            }
            if (session?.user?.name  && trigger === 'update') {
                token.name = session.user.name
            }
            return token
        },
    }
} satisfies NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)