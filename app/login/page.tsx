"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
try {
        const signinResponse = await signIn("credentials", {
        username: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
    if (signinResponse?.error) return setError(signinResponse.error as string);
    if (signinResponse?.ok) return router.push("/inicio");
    console.log(signinResponse);
} catch (error) {
    console.error(error);
}
    

    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div>{error}</div>}
        <h1>Login</h1>
        <input type="email" name="email" placeholder="winter@gmail.com" />
        <input type="password" name="password" placeholder="******" />
        <button>Iniciar Sesion</button>
      </form>
    </div>
  );
}

export default LoginPage;
