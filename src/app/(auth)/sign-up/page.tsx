"use client"

import type React from "react"

import { useActionState, useEffect, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle } from "lucide-react"
import { signUp } from "@/actions/user.actions"
import { schema } from "@/lib/schema"
import type { AuthState } from "@/../types"
import { ZodError } from "zod"

const initialState: AuthState = {
  success: false,
}

const Page = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [hasInteracted, setHasInteracted] = useState({
    email: false,
    password: false,
  })
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(signUp, initialState)

  const validateForm = useCallback(() => {
    const errors: { email?: string; password?: string } = {}

    try {
      schema.parse({ email, password })
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === "email") {
            errors.email = "Введите корректную электронную почту"
          }
          if (err.path[0] === "password") {
            errors.password = "Пароль должен содержать минимум 7 символов"
          }
        })
      }
      return { isValid: false, errors }
    }
  }, [email, password])

  const validation = useMemo(() => validateForm(), [validateForm])

  useEffect(() => {
    const newErrors: { email?: string; password?: string } = {}

    if (hasInteracted.email && validation.errors.email) {
      newErrors.email = validation.errors.email
    }

    if (hasInteracted.password && validation.errors.password) {
      newErrors.password = validation.errors.password
    }

    setValidationErrors(newErrors)
  }, [validation.errors, hasInteracted])

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/sign-in")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.success, router])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleEmailBlur = () => {
    setHasInteracted((prev) => ({ ...prev, email: true }))
  }

  const handlePasswordBlur = () => {
    setHasInteracted((prev) => ({ ...prev, password: true }))
  }

  const canSubmit = validation.isValid && email.length > 0 && password.length > 0

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Создать аккаунт</h1>

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state.success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {state.message || "Аккаунт успешно создан! Перенаправляем на страницу входа..."}
            </AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="email"
              placeholder="Электронная почта"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
              autoComplete="email"
              disabled={isPending}
              className={validationErrors.email ? "border-red-500" : ""}
            />
            <div className="min-h-[20px]">
              {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              name="password"
              placeholder="Пароль (минимум 7 символов)"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              required
              autoComplete="new-password"
              disabled={isPending}
              className={validationErrors.password ? "border-red-500" : ""}
            />
            <div className="min-h-[20px]">
              {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
            </div>
          </div>

          <Button className="w-full cursor-pointer" type="submit" disabled={isPending || !canSubmit}>
            {isPending ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        <div className="text-center">
          <Button asChild variant="link" className="cursor-pointer">
            <Link href="/sign-in">Уже есть аккаунт? Авторизоваться</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page
