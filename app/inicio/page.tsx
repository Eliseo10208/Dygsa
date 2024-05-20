"use client"
import { useSession } from "next-auth/react"
function Inicio(){

    const {data: session, status} = useSession()
    if(status === 'loading') return <div>Cargando...</div>
    if(status === 'unauthenticated') return <div>No autenticado</div>
    console.log(session)

    return (
        <div>
            holaa inicio
        </div>
    )
}
export default Inicio