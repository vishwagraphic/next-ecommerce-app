'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReviewForm from './review-form'
import { getReviews } from '@/lib/actions/review.actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User } from 'lucide-react'
import Rating from '@/components/shared/product/rating'

type ReviewListProps = {
  userId?: string
  productId: string
  productSlug: string
}

type Review = {
  id: string
  rating: number
  title: string | null
  description: string | null
  created_at: string
  user: { name: string | null }
}

const ReviewList = ({userId, productId, productSlug}: ReviewListProps) => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [error, setError] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        let isActive = true

        const loadReviews = async () => {
            try {
                const response = await getReviews(productId)
                if (!response.success) {
                    throw new Error('Unable to load reviews.')
                }
                const data = response.data
                if (isActive) {
                    setReviews(data as any)
                    setError('')
                }
            } catch (error) {
                if (isActive) {
                    setError('Reviews could not be loaded.')
                }
                console.error(error)
            }
        }

        void loadReviews()
        return () => { isActive = false }
    }, [productId, refreshKey])

  const reload = () => setRefreshKey((key) => key + 1)

  return (
    <div className="space-y-4">
      {error && <p role="alert">{error}</p>}
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {userId ? <ReviewForm productId={productId} userId={userId} onReviewSubmitted={reload} /> :
      <div>Please <Link href={`/sign-in?callbackUrl=/product/${productSlug}`}>log in</Link> to write reviews.</div>
      }
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id} className="border-b pb-3">
            <CardHeader>
                <div className="flex-between">
                    <CardTitle className="font-semibold">{review.title}</CardTitle>
                </div>
                <CardDescription>
                    {review.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                    <Rating value={review.rating} />
                   <div className="flex items-center">
                     <User className="mr-1 h-3 w-3" />
                     <span>{review.user ? review.user.name : 'User'}</span>
                   </div>
                   <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{new Date(review.created_at).toLocaleDateString()}</span>
                   </div>
                </div>
            </CardContent>
           
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReviewList