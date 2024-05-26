"use client"
import { useSession } from "next-auth/react"
import '@/app/assets/css/Styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@/app/assets/css/checkbox.css'
function Inicio(){

    const {data: session, status} = useSession()
    if(status === 'loading') return <div>Cargando...</div>
    if(status === 'unauthenticated') return <div>No autenticado</div>
    console.log(session)

    return (
        <div className="control-container">
        <div className="control-nav">
            <div className="logo"></div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-home"></i>
                    <div className="nav-txt">Registro de viaje</div>
                </div>
            </div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-truck"></i>
                    <div className="nav-txt">Unidades</div>
                </div>
                <ul>
                    <li>Vehículos</li>
                    <li>Remolques</li>
                    <li>Configuración</li>
                </ul>
            </div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-id-card"></i>
                    <div className="nav-txt">Operadores</div>
                </div>
            </div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-road"></i>
                    <div className="nav-txt">Rutas</div>
                </div>
            </div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-users"></i>
                    <div className="nav-txt">Clientes</div>
                </div>
            </div>
            <div className="nav-group">
                <div>
                    <i className="fa fa-screwdriver"></i>
                    <div className="nav-txt">Administración</div>
                </div>
                <ul>
                    <li>Accesos</li>
                    <li>Permisos</li>
                </ul>
            </div>
        </div>
    
        <div className="control-content">
            <div className="control-header">
                <button className="nav-bar">
                    <i className="fa fa-bars"></i>
                </button>
    
                <div className="control-user">
                    <button className="btn">
                        <img src="/assets/img/photodefault.png" /> Nombre de Usuario <i className="fas fa-caret-down"></i>
                    </button>
                    <ul>
                        <li>Configuración</li>
                        <li>Salir</li>
                    </ul>
                </div>
            </div>
            <div className="content">
                {/* Aquí se puede incluir el contenido condicional */}
            </div>
        </div>
    </div>
    
    )
}
export default Inicio