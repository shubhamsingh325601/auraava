"use client"

import { useState } from "react"

export interface CheckoutFormValues {
    fullName: string
    mobileNumber: string
    email: string
    addressLine: string
    city: string
    state: string
    pincode: string
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>

export const EMPTY_CHECKOUT_FORM: CheckoutFormValues = {
    fullName: "",
    mobileNumber: "",
    email: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
}

export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFormErrors {
    const errors: CheckoutFormErrors = {}

    if (!values.fullName.trim()) {
        errors.fullName = "Full name is required"
    } else if (values.fullName.trim().length < 2) {
        errors.fullName = "Enter a valid full name"
    }

    if (!values.mobileNumber.trim()) {
        errors.mobileNumber = "Mobile number is required"
    } else if (!/^[6-9]\d{9}$/.test(values.mobileNumber.trim())) {
        errors.mobileNumber = "Enter a valid 10-digit mobile number"
    }

    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = "Enter a valid email address"
    }

    if (!values.addressLine.trim()) {
        errors.addressLine = "Address is required"
    } else if (values.addressLine.trim().length < 5) {
        errors.addressLine = "Enter a complete address"
    }

    if (!values.city.trim()) {
        errors.city = "City is required"
    }

    if (!values.state.trim()) {
        errors.state = "State is required"
    }

    if (!values.pincode.trim()) {
        errors.pincode = "PIN code is required"
    } else if (!/^\d{6}$/.test(values.pincode.trim())) {
        errors.pincode = "Enter a valid 6-digit PIN code"
    }

    return errors
}

interface CheckoutFormProps {
    values: CheckoutFormValues
    errors: CheckoutFormErrors
    onChange: (field: keyof CheckoutFormValues, value: string) => void
}

export default function CheckoutForm({ values, errors, onChange }: CheckoutFormProps) {
    return (
        <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-serif text-xl text-primary">Shipping Details</h2>
            <div className="my-5 h-px bg-border" />

            <div className="grid sm:grid-cols-2 gap-5">
                <Field
                    label="Full Name"
                    required
                    name="fullName"
                    value={values.fullName}
                    error={errors.fullName}
                    onChange={onChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="sm:col-span-2"
                />

                <Field
                    label="Mobile Number"
                    required
                    name="mobileNumber"
                    value={values.mobileNumber}
                    error={errors.mobileNumber}
                    onChange={onChange}
                    placeholder="9876543210"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                />

                <Field
                    label="Email"
                    name="email"
                    value={values.email}
                    error={errors.email}
                    onChange={onChange}
                    placeholder="jane@example.com (optional)"
                    type="email"
                    autoComplete="email"
                />

                <Field
                    label="Address Line"
                    required
                    name="addressLine"
                    value={values.addressLine}
                    error={errors.addressLine}
                    onChange={onChange}
                    placeholder="House no., street, locality"
                    autoComplete="address-line1"
                    className="sm:col-span-2"
                />

                <Field
                    label="City"
                    required
                    name="city"
                    value={values.city}
                    error={errors.city}
                    onChange={onChange}
                    placeholder="Mumbai"
                    autoComplete="address-level2"
                />

                <Field
                    label="State"
                    required
                    name="state"
                    value={values.state}
                    error={errors.state}
                    onChange={onChange}
                    placeholder="Maharashtra"
                    autoComplete="address-level1"
                />

                <Field
                    label="PIN Code"
                    required
                    name="pincode"
                    value={values.pincode}
                    error={errors.pincode}
                    onChange={onChange}
                    placeholder="400001"
                    inputMode="numeric"
                    autoComplete="postal-code"
                />
            </div>
        </div>
    )
}

function Field({
    label,
    required,
    name,
    value,
    error,
    onChange,
    placeholder,
    type = "text",
    inputMode,
    autoComplete,
    className,
}: {
    label: string
    required?: boolean
    name: keyof CheckoutFormValues
    value: string
    error?: string
    onChange: (field: keyof CheckoutFormValues, value: string) => void
    placeholder?: string
    type?: string
    inputMode?: "text" | "numeric" | "tel" | "email"
    autoComplete?: string
    className?: string
}) {
    return (
        <div className={className}>
            <label htmlFor={name} className="block text-xs uppercase tracking-wider font-semibold text-primary mb-2">
                {label} {required && <span className="text-destructive">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                inputMode={inputMode}
                autoComplete={autoComplete}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`w-full px-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${error ? "border-destructive" : "border-border"
                    }`}
            />
            {error && (
                <p id={`${name}-error`} className="mt-1.5 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}
