import { cn } from 'cn'
import React from 'react'

const CheckoutSteps = ({currentStep = 0}: {currentStep: number}) => {
    return (
        <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
            {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map((step:string, index:number) => (
                <React.Fragment key={index}>
                    <span className={cn(`p-2 w-56 rounded-full text-center text-sm`, index === currentStep ? 'bg-secondary' : '')}>
                        {step}
                    </span>
                    {index !== 3 && (<hr className="w-16 border-t border-gray-300 mx-2" />)}
                </React.Fragment>

            ))}
        </div>
    )
}

export default CheckoutSteps