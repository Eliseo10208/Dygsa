"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import "@/app/assets/css/Styles.css";
import "@/app/assets/css/checkbox.css";
import Link from "next/link";
import ClientesPanel from "../pages/clients/page";
import ViajesPanel from "../pages/viajes/page";
import Image from "next/image";
import logo2 from '@/app/assets/img/logo2.png'
const Inicio: React.FC = () => {
    const { data: session, status } = useSession();
    const [activeComponent, setActiveComponent] = useState<string>("");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const handleMenuClick = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const pagemenu = (page: string) => {
        setActiveComponent(page);
        console.log(`Navigating to ${page}`);
    };

    const renderContent = () => {
        switch (activeComponent) {
            case "Clientes":
                return <ClientesPanel/>;
            
            default:
                return <ViajesPanel/>;
        }
    };

    if (status === "loading") return <div>Cargando...</div>;
    if (status === "unauthenticated") return <div>No autenticado</div>;

    return (
        <div className="control-container">
            <div className="control-nav">
                <div className="logo">
                   <Image 
                   src={logo2}
                   alt="nada"
                    width={200}
                    height={100}
                   />
                </div>
                <div className="nav-group">
                    <div>
                        <i className="fa fa-home"></i>
                        <div className="nav-txt" onClick={() => setActiveComponent("Viajes")} >Registro de viaje</div>
                    </div>
                </div>
                <div className="nav-group">
                    <div className="" onClick={() => handleMenuClick("unidades")}>
                        <i className="fa fa-truck"></i>
                        <div className="nav-txt">Unidades</div>
                    </div>
                    <ul style={{ display: openMenu === "unidades" ? "block" : "none" }}>
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
                <div
                    className="nav-group"
                    onClick={() => setActiveComponent("Clientes")}
                >
                    <div>
                        <i className="fa fa-users"></i>
                        <div className="nav-txt">Clientes</div>
                    </div>
                </div>
                <div className="nav-group">
                    <div className="" onClick={() => handleMenuClick("administracion")}>
                        <i className="fa fa-screwdriver"></i>
                        <div className="nav-txt">Administración</div>
                    </div>
                    <ul style={{ display: openMenu === "administracion" ? "block" : "none" }}>
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
                            <img src="/assets/img/photodefault.png" /> Nombre de
                            Usuario <i className="fas fa-caret-down"></i>
                        </button>
                        <ul>
                            <li>Configuración</li>
                            <li>Salir</li>
                        </ul>
                    </div>
                </div>
                <div className="content">{renderContent()}</div>
            </div>
        </div>
    );
};

export default Inicio;
