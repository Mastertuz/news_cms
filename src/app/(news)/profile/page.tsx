import { auth } from "../../../../auth"
import { getUserInfo } from "@/actions/user.actions"
import ProfileClient from "@/components/shared/profile-client"
import { redirect } from "next/navigation"
export const metadata = {
  title: "Профиль пользователя | Новостной портал",
  description: "Управление профилем и подпиской",
}

export default async function ProfilePage() {
  const session = await auth()
  const user = session?.user
  if(!user) redirect("/sign-in")
  const info = await getUserInfo(user?.id || "")
  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold">Профиль пользователя</h1>
        <p className="text-muted-foreground mt-2">Пожалуйста, войдите в систему для доступа к профилю.</p>
      </div>
    )
  }
  

  return (
    <ProfileClient
      info={{ 
        ...info, 
        name: info.name ?? "", 
        subscriptionExpires: info.subscriptionExpires ?? undefined 
      }}
      user={{
        id: user.id ?? "",
        name: user.name ?? "",
        email: user.email ?? ""
      }}
    />
  )
}