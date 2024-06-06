// pages/login.tsx
'use client'
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/app/assets/img/logo.png'
//Hojaas de estilos importadas de la ruta .......
import '@/app/assets/css/Styles.css'
import '@/app/assets/css/checkbox.css'
function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        try {
            const signinResponse = await signIn("credentials", {
                redirect: false,
                username: formData.get("email") as string,
                password: formData.get("password") as string,
            });

            if (signinResponse?.error) {
                setError(signinResponse.error);
            } else if (signinResponse?.ok) {
                router.push('/pages/viajes');
            } else {
                console.log(signinResponse);
            }
        } catch (error) {
            console.error(error);
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div className="login-content">
            <div className="login-logo">
                <Image src={Logo}
                width={200}
                height={100}
                alt='logo'/>
            </div>
            <h6>HOLA, Bienvenido de nuevo!</h6>
            <form data-ajax="false" className="login-form" onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="login-group">
                    <input name="email" type="email" className="login-input" placeholder="Correo Electrónico" required />
                </div>
                <div className="login-group">
                    <input name="password" type="password" className="login-input" placeholder="Contraseña" required />
                    <div style={{ textAlign: 'right' }}>
                        <button type="button" className="btn btn_recovery">¿Olvidaste la contraseña?</button>
                    </div>
                </div>
                <div className="login-button">
                    <button type="submit" className="btn btn-login">Ingresar</button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
